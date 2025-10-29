import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDeleteTestimonialMutation, useGetAllTestimonialsAdminQuery } from "@/redux/features/testimonial/testimonial.api";
import TestimonialTable from "@/components/modules/Testimonial/TestimonialTable";
import { UpdateTestimonialDialog } from "./UpdateTestimonialDialog";
import { handleApiError } from "@/utils/errorHandler";
import type { ITestimonial } from "@/interface";


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
    console.log(id);
    try {
      await deleteTestimonial(id).unwrap();
      toast.success("Testimonial deleted");
      refetch();
    } catch (err) {
handleApiError(err)
    }
  };

  return (
    <div className="p-4 max-w-[1200px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Testimonials</h1>
        <div className="flex gap-2 items-center">
    
          <Select onValueChange={(v) => setSort(v)}>
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

      <Card className="p-2">
        <TestimonialTable
          response={{ data: testimonials }}
          onEdit={(t: ITestimonial) => {
            setSelectedTestimonial(t);
            setUpdateOpen(true);
          }}
          onDelete={handleDelete}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">Showing {testimonials.length} of {meta.total}</div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="px-3 py-1 border rounded">Page {page} / {totalPages}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <UpdateTestimonialDialog
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        testimonial={selectedTestimonial}
        refetch={refetch}
      />

      {(isLoading || deleting) && (
        <div className="fixed bottom-4 right-4 bg-white px-3 py-2 rounded shadow">
          Loading...
        </div>
      )}
    </div>
  );
}






