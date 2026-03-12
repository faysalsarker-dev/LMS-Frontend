const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const domainMap = {
  'components/modules/home': 'components/public/home',
  'components/modules/auth': 'components/public/auth',
  'components/modules/checkout': 'components/public/checkout',
  'components/modules/adminDashboard': 'components/admin/dashboard',
  'components/modules/Course': 'components/admin/course',
  'components/modules/Category': 'components/admin/category',
  'components/modules/Testimonial': 'components/admin/testimonial',
  'components/modules/User': 'components/admin/user',
  'components/modules/assignment': 'components/admin/assignment',
  'components/modules/enrolment': 'components/admin/enrolment',
  'components/modules/lesson-editor': 'components/admin/lesson-editor',
  'components/modules/milestone': 'components/admin/milestone',
  'components/modules/promo': 'components/admin/promo',
  'components/modules/lessonPage': 'components/student/lesson-page',
  'components/modules/profile': 'components/student/profile',
  'components/modules/student': 'components/student/dashboard',
  'components/modules/practice': 'components/student/practice',
  'components/modules/mockTest': 'components/student/mock-test'
};

const dirRenames = {};
for (const [oldRel, newRel] of Object.entries(domainMap)) {
   dirRenames[path.join(__dirname, 'src', oldRel).replace(/\\/g, '/')] = path.join(__dirname, 'src', newRel).replace(/\\/g, '/');
}

function getNewAbsolutePath(oldAbsolute) {
   let normalizedOld = oldAbsolute.replace(/\\/g, '/');
   for (const [oldDir, newDir] of Object.entries(dirRenames)) {
        if (normalizedOld === oldDir || normalizedOld.startsWith(oldDir + '/')) {
            return normalizedOld.replace(oldDir, newDir);
        }
   }
   return normalizedOld;
}

function resolveImportPath(fileOldAbs, reqPath) {
    if (reqPath.startsWith('@/')) {
        return path.join(__dirname, 'src', reqPath.slice(2)).replace(/\\/g, '/');
    } else if (reqPath.startsWith('.')) {
        return path.resolve(path.dirname(fileOldAbs), reqPath).replace(/\\/g, '/');
    }
    return null;
}

function computeNewImportString(fileNewAbs, targetFileNewAbs, originalReqPath) {
    if (originalReqPath.startsWith('@/')) {
        let relToSrc = path.relative(path.join(__dirname, 'src'), targetFileNewAbs).replace(/\\/g, '/');
        return '@/' + relToSrc;
    } else if (originalReqPath.startsWith('.')) {
        let newRel = path.relative(path.dirname(fileNewAbs), targetFileNewAbs).replace(/\\/g, '/');
        if (!newRel.startsWith('.')) {
            newRel = './' + newRel;
        }
        return newRel;
    }
    return originalReqPath;
}

function walkSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          filelist.push(path.join(dir, file).replace(/\\/g, '/'));
      }
    }
  });
  return filelist;
}

const allFilesOldAbs = walkSync(srcDir);
const filesToUpdate = [];

allFilesOldAbs.forEach(fileOldAbs => {
   const fileNewAbs = getNewAbsolutePath(fileOldAbs);
   const content = fs.readFileSync(fileOldAbs, 'utf8');
   
   // A highly reliable regex that looks for strings following `import` or `from` on the same line/statement loosely
   // It grabs the string at the end of the import statement.
   // Handles: import "path"; import React from "path"; export { x } from "path"; await import("path")
   const regex = /(?:import|export)[\s\S]*?(?:from\s*)?(['"])([^'"]+)\1|import\s*\(\s*(['"])([^'"]+)\3\s*\)/g;

   let newContent = content.replace(regex, (match, q1, path1, q2, path2) => {
       const reqPath = path1 || path2;
       const usedQuote = q1 || q2;
       
       if (!reqPath.startsWith('.') && !reqPath.startsWith('@/')) {
           return match; // Node module, skip
       }
       
       const targetOldAbs = resolveImportPath(fileOldAbs, reqPath);
       if (!targetOldAbs) return match;
       
       const targetNewAbs = getNewAbsolutePath(targetOldAbs);
       
       if (fileOldAbs === fileNewAbs && targetOldAbs === targetNewAbs) {
           return match; // neither moved
       }
       
       const newReqPath = computeNewImportString(fileNewAbs, targetNewAbs, reqPath);
       
       if (newReqPath === reqPath) return match;
       
       // Reconstruct string
       const replacementRegex = new RegExp(`${usedQuote}${reqPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${usedQuote}`);
       return match.replace(replacementRegex, `${usedQuote}${newReqPath}${usedQuote}`);
   });

   if (fileOldAbs !== fileNewAbs || content !== newContent) {
       filesToUpdate.push({
           fileOldAbs,
           fileNewAbs,
           newContent,
           oldContent: content
       });
   }
});

// Create base target directories
[ 'src/components/public', 'src/components/admin', 'src/components/student' ].forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Rename directories
Object.entries(domainMap).forEach(([srcRel, destRel]) => {
  const src = path.join(__dirname, 'src', srcRel);
  const dest = path.join(__dirname, 'src', destRel);
  if (fs.existsSync(src)) {
    console.log(`Moving ${src} to ${dest}`);
    try {
        fs.renameSync(src, dest);
    } catch (err) {
        console.error(`Error renaming ${src}, copying instead...`);
        fs.cpSync(src, dest, { recursive: true });
        fs.rmSync(src, { recursive: true, force: true });
    }
  }
});

// Remove old modules dir if empty
try {
   if (fs.existsSync(path.join(__dirname, 'src/components/modules')) && fs.readdirSync(path.join(__dirname, 'src/components/modules')).length === 0) {
       fs.rmdirSync(path.join(__dirname, 'src/components/modules'));
   }
} catch(e) {}

// Write updated files
filesToUpdate.forEach(update => {
    // Make sure dir exists
    const dir = path.dirname(update.fileNewAbs);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(update.fileNewAbs, update.newContent, 'utf8');
    console.log(`Updated imports/locations for ${update.fileNewAbs}`);
});

console.log("SUCCESS!");
