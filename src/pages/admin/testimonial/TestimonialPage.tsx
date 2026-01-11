import { useState } from "react";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDeleteTestimonialMutation, useGetAllTestimonialsAdminQuery } from "@/redux/features/testimonial/testimonial.api";
import TestimonialTable from "@/components/modules/Testimonial/TestimonialTable";
import { UpdateTestimonialDialog } from "./UpdateTestimonialDialog";
import { handleApiError } from "@/utils/errorHandler";
import type { ITestimonial } from "@/interface/testimonial.types";

export default function TestimonialsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sort, setSort] = useState("newest");
  const [selectedTestimonial, setSelectedTestimonial] = useState<ITestimonial | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);

  const { data: response, isLoading, refetch } = useGetAllTestimonialsAdminQuery({ page, limit, sort });
  const [deleteTestimonial, { isLoading: deleting }] = useDeleteTestimonialMutation();

  const meta = response?.data?.meta || { total: 0, page, limit };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / limit));
  const testimonials = response?.data.data || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id).unwrap();
      toast.success("Testimonial deleted");
      refetch();
    } catch (err) {
      handleApiError(err);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-4 max-w-[1200px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Testimonials</h1>
        <div className="flex gap-2 items-center">
          <Select onValueChange={(v) => setSort(v)} defaultValue={sort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {/* Table Header Skeleton */}
            <div className="flex gap-4 pb-3 border-b">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
            {/* Table Rows Skeleton */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 py-3 border-b">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <TestimonialTable
              response={{ data: testimonials }}
              onEdit={(t: ITestimonial) => {
                setSelectedTestimonial(t);
                setUpdateOpen(true);
              }}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {testimonials.length} of {meta.total}
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, idx) => (
                    <PaginationItem key={idx}>
                      {pageNum === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setPage(pageNum as number)}
                          isActive={page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </Card>

      <UpdateTestimonialDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        testimonial={selectedTestimonial}
        refetch={refetch}
      />

      {deleting && (
        <div className="fixed bottom-4 right-4 bg-background border px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm">Deleting...</span>
          </div>
        </div>
      )}
    </div>
  );
}