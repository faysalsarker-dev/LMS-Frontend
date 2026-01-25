import { motion } from 'framer-motion';

import { PracticeForm } from '@/components/modules/practice';


const CreatePracticePage = () => {


 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
      

        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Practice</h1>
          <p className="text-muted-foreground mt-1">
            Add a new learning practice with items
          </p>
        </div>

        <PracticeForm  />
      </div>
    </motion.div>
  );
};

export default CreatePracticePage;
