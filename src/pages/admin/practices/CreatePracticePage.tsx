import { motion } from 'framer-motion';
import {  useNavigate } from 'react-router';

import { PracticeForm } from '@/components/modules/practice';
import type { PracticeFormData } from '@/components/modules/practice';
import toast from 'react-hot-toast';
import { useCreatePracticeMutation } from '@/hooks/usePracticeApi';

const CreatePracticePage = () => {
  const navigate = useNavigate();
  const { createPractice, isLoading } = useCreatePracticeMutation();

  const handleSubmit = async (data: PracticeFormData) => {
    try {
      await createPractice(data);
      toast.success('Practice created successfully!');
      navigate('/admin/practices');
    } catch (error) {
      toast.error('Failed to create practice');
    }
  };

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

        <PracticeForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </motion.div>
  );
};

export default CreatePracticePage;
