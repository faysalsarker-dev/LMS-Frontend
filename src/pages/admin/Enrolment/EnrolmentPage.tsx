import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  EnrolmentFilters,
  EnrolmentTable,
  EnrolmentPagination,
  EnrolmentDialog,
} from '@/components/modules/enrolment';

import type { IEnrolment, EnrolmentFiltersState, UpdateEnrolmentData } from '@/interface/enrolment.types';
import { useGetAllEnrolmentsQuery, useUpdateEnrolmentMutation } from '@/redux/features/enrollment/enrollment.api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const EnrolmentsPage = () => {
  const [filters, setFilters] = useState<EnrolmentFiltersState>({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all',
    course: '',
    search: '',
    page: 1,
    limit: 10,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEnrolment, setSelectedEnrolment] = useState<IEnrolment | null>(null);

  const { data, isLoading, refetch } = useGetAllEnrolmentsQuery(filters);
  const [updateEnrolment, { isLoading: isUpdating }] = useUpdateEnrolmentMutation();

  const enrolments = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }));
      }, 300),
    []
  );

  const handleFilterChange = useCallback(
    (key: keyof EnrolmentFiltersState, value: string | number) => {
      if (key === 'search') {
        debouncedSearch(value as string);
      } else if (key === 'page') {
        setFilters((prev) => ({ ...prev, page: value as number }));
      } else {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
      }
    },
    [debouncedSearch]
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleView = useCallback((enrolment: IEnrolment) => {
    setSelectedEnrolment(enrolment);
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (id: string, data: UpdateEnrolmentData) => {
      try {
        await updateEnrolment({ id, data });
        toast.success('Enrolment updated successfully');
        refetch();
        setDialogOpen(false);
        setSelectedEnrolment(null);
      } catch (error) {
        toast.error('Failed to update enrolment');
      }
    },
    [updateEnrolment, refetch]
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto py-8 px-4 max-w-7xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Enrolments</h1>
        </div>
        <p className="text-muted-foreground">
          Manage course enrolments and payment status
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">All Enrolments</CardTitle>
              <span className="text-sm text-muted-foreground">
                {meta.total} total enrolments
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <EnrolmentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Table */}
            <EnrolmentTable
              enrolments={enrolments}
              isLoading={isLoading}
              onView={handleView}
            />

            {/* Pagination */}
            <EnrolmentPagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog */}
      <EnrolmentDialog
        enrolment={selectedEnrolment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
      />
    </motion.div>
  );
};

export default EnrolmentsPage;
