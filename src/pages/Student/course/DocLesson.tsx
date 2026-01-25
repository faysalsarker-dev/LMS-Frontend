import { motion } from "framer-motion";

interface DocLessonProps {
  doc?: string;
}

export function DocLesson({ doc }: DocLessonProps) {
  if (!doc) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 text-lg">
        No document content available.
      </div>
    );
  }

  return (
   <motion.div
  className="p-6 bg-white rounded-2xl shadow-lg overflow-y-auto max-h-[70vh] border border-gray-100"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div
    className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: doc }}
  />
</motion.div>
  );
}
