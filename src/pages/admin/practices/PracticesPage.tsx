import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {  Plus } from 'lucide-react';
import {
  PracticeStats,
  PracticeFilters,
  PracticeList,
} from '@/components/modules/practice';
import { useGetAllPracticesQuery } from '@/redux/features/practice/practice.api';

const PracticesPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    search: '',
    type: '',
    difficulty: '',
    category: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, refetch } = useGetAllPracticesQuery(filters);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
      

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Practice Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, manage, and organize learning practices
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/practices/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Practice
            </Link>
          </Button>
        </div>

        {/* Stats */}
        {/* <PracticeStats /> */}

        {/* Filters */}
        <PracticeFilters filters={filters} onFiltersChange={setFilters} />

        {/* List */}
        <PracticeList data={data} isLoading={isLoading} onRefetch={refetch} />

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setFilters((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))
                  }
                  className={filters.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: data.meta.totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                    isActive={filters.page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      page: Math.min(data.meta.totalPages, (f.page || 1) + 1),
                    }))
                  }
                  className={
                    filters.page === data.meta.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </motion.div>
  );
};

export default PracticesPage;
