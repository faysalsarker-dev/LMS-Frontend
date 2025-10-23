import { motion } from "framer-motion";

export function DocLesson({ docContent }: { docContent?: string }) {
  if (!docContent)
    return (
      <div className="text-center text-gray-500 py-10">
        No document content available.
      </div>
    );


  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-md overflow-y-auto max-h-[70vh]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
   {
    docContent
   }
    </motion.div>
  );
}
