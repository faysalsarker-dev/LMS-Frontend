import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { Home } from 'lucide-react';
import { PracticeForm } from '@/components/modules/practice';
import type { PracticeFormData } from '@/components/modules/practice';
import { useGetPracticeByIdQuery, useUpdatePracticeMutation } from '@/hooks/usePracticeApi';
import toast from 'react-hot-toast';

const EditPracticePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: practice, isLoading: isLoadingPractice } = useGetPracticeByIdQuery(id || '');
  const { updatePractice, isLoading: isUpdating } = useUpdatePracticeMutation();

  const handleSubmit = async (data: PracticeFormData) => {
    if (!id) return;
    try {
      await updatePractice(id, data);
      toast.success('Practice updated successfully!');
      navigate('/admin/practices');
    } catch (error) {
      toast.error('Failed to update practice');
    }
  };

  if (isLoadingPractice) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-96" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Practice not found</h2>
        <p className="text-muted-foreground mt-2">The practice you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/dashboard" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/practices">Practices</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Practice</h1>
          <p className="text-muted-foreground mt-1">Update "{practice.title}"</p>
        </div>

        <PracticeForm initialData={practice} onSubmit={handleSubmit} isSubmitting={isUpdating} />
      </div>
    </motion.div>
  );
};

export default EditPracticePage;
