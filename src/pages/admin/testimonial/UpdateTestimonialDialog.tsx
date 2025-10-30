import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useUpdateTestimonialMutation } from "@/redux/features/testimonial/testimonial.api";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/utils/errorHandler";
import type { ITestimonial } from "@/interface";
import { Textarea } from "@/components/ui/textarea";




interface UpdateTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: ITestimonial | null;
  refetch: () => void;
}

export function UpdateTestimonialDialog({ open, onOpenChange, testimonial, refetch }: UpdateTestimonialDialogProps) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { rating: 5, review: "" } });
  const [updateTestimonial, { isLoading }] = useUpdateTestimonialMutation();

 useEffect(() => {
    if (testimonial) {
      reset({ rating: testimonial.rating, review: testimonial.review });
    }
  }, [testimonial, reset]);

  const onSubmit = async (data: { rating: number; review: string }) => {
    try {
      await updateTestimonial({ testimonialId: testimonial!._id, payload: data }).unwrap();
      toast.success("Updated successfully");
      onOpenChange(false);
      refetch();
    } catch (err) {
handleApiError(err)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Rating</label>
            <Input type="number" {...register("rating", { valueAsNumber: true, min: 1, max: 5 })} />
          </div>
          <div>
            <label className="text-sm font-medium">Review</label>
            <Textarea className="min-h-32" {...register("review", { required: true })} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Updating..." : "Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
