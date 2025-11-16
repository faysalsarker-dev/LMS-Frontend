import { useForm } from "react-hook-form";
import type { PromoCode } from "@/data/mockPromoData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

interface EditPromoModalProps {
  promo: PromoCode | null;
  open: boolean;
  onClose: () => void;
}

interface PromoFormData {

  code?:string;
  description: string;
  discountValue: number;
  discountType: "percentage" | "fixed";
  maxUsageCount: number;
  maxUsagePerUser: number;
  expirationDate: string;
}

export const EditPromoModal = ({ promo, open, onClose }: EditPromoModalProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PromoFormData>({
    defaultValues: promo ? {
      description: promo.description,
      discountValue: promo.discountValue,
      discountType: promo.type,
      maxUsageCount: promo.maxUsageCount,
      maxUsagePerUser: promo.maxUsagePerUser,
      expirationDate: promo.expirationDate,
    } : undefined,
  });

  const discountType = watch("discountType");

  const onSubmit = (data: PromoFormData) => {
    console.log("Updated promo data:", data);
    toast.success("Promo code updated successfully!");
    onClose();
  };

  if (!promo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Promo Code</DialogTitle>
          <DialogDescription>
            Update the details for promo code: <strong>{promo.code}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Code">Code</Label>
            <Input
              id="code"
              {...register("code", { required: "code is required" })}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(value) => setValue("discountType", value as "percentage" | "fixed")}
              >
                <SelectTrigger id="discountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                {...register("discountValue", { 
                  required: "Discount value is required",
                  min: { value: 1, message: "Must be at least 1" }
                })}
                placeholder={discountType === "percentage" ? "%" : "$"}
              />
              {errors.discountValue && (
                <p className="text-sm text-destructive">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsageCount">Max Total Uses</Label>
              <Input
                id="maxUsageCount"
                type="number"
                {...register("maxUsageCount", { 
                  required: "Max usage is required",
                  min: { value: 1, message: "Must be at least 1" }
                })}
              />
              {errors.maxUsageCount && (
                <p className="text-sm text-destructive">{errors.maxUsageCount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsagePerUser">Max Uses Per User</Label>
              <Input
                id="maxUsagePerUser"
                type="number"
                {...register("maxUsagePerUser", { 
                  required: "Max per user is required",
                  min: { value: 1, message: "Must be at least 1" }
                })}
              />
              {errors.maxUsagePerUser && (
                <p className="text-sm text-destructive">{errors.maxUsagePerUser.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              type="date"
              {...register("expirationDate", { required: "Expiration date is required" })}
            />
            {errors.expirationDate && (
              <p className="text-sm text-destructive">{errors.expirationDate.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};