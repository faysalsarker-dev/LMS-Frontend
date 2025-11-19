import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import toast from "react-hot-toast";
import { useUpdatePromoMutation } from "@/redux/features/promo/promo.api";
import { handleApiError } from "@/utils/errorHandler";
import type { IPromo } from "@/interface/promo.interfaces";

interface EditPromoModalProps {
  promo: IPromo;
  open: boolean;
  onClose: () => void;
}



export const EditPromoModal = ({ promo, open, onClose }: EditPromoModalProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<Partial<IPromo>>();

  const [updatePromo, { isLoading }] = useUpdatePromoMutation();

  useEffect(() => {
    if (promo) {
      reset({
        code: promo.code,
        description: promo.description,
        discountValue: promo.discountValue,
        discountType: promo.discountType as "percentage" | "fixed",
        maxUsageCount: promo.maxUsageCount ?? null,
        maxUsagePerUser: promo.maxUsagePerUser,
        minOrderAmount: promo.minOrderAmount,
        isActive: promo.isActive,
        validFrom: promo.validFrom,
        expirationDate: promo.expirationDate,
      });
    }
  }, [promo,reset]);

  const discountType = watch("discountType");
  const validFrom = watch("validFrom");
  const expirationDate = watch("expirationDate");
  const isActive = watch("isActive");

  const onSubmit = async (data: Partial<IPromo>) => {
    try {
      await updatePromo({
        id: promo._id,
        data,
      }).unwrap();

      toast.success("Promo updated successfully!");
      reset()
      onClose();
    } catch (err) {
      handleApiError(err);
    }
  };

  if (!promo) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-auto max-h-[80%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Promo Code</DialogTitle>
          <DialogDescription>
            Updating promo for <strong>{promo.code}</strong>
          </DialogDescription>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 mt-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Code */}
          <div className="space-y-2">
            <Label>Promo Code</Label>
            <Input {...register("code", { required: true })} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...register("description", { required: true })} />
          </div>

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(v: "percentage" | "fixed") => setValue("discountType", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Value</Label>
              <Input
                type="number"
                placeholder={discountType === "percentage" ? "10%" : "$20"}
                {...register("discountValue")}
              />
            </div>
          </div>

          {/* Usage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Total Uses</Label>
              <Input type="number" {...register("maxUsageCount")} />
            </div>
            <div>
              <Label>Max Per User</Label>
              <Input type="number" {...register("maxUsagePerUser")} />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            {/* Valid From */}
            <div className="space-y-2">
              <Label>Valid From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start")}>
                    {validFrom ? format(new Date(validFrom), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={validFrom ? new Date(validFrom) : undefined}
                    onSelect={(d) =>
                      d && setValue("validFrom", d.toISOString().split("T")[0])
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <Label>Expiration</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start")}>
                    {expirationDate
                      ? format(new Date(expirationDate), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={expirationDate ? new Date(expirationDate) : undefined}
                    onSelect={(d) =>
                      d && setValue("expirationDate", d.toISOString().split("T")[0])
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Min order + status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Minimum Order Amount</Label>
              <Input type="number" {...register("minOrderAmount")} />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={isActive ? "active" : "inactive"}
                onValueChange={(v) => setValue("isActive", v === "active")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 justify-between">
            <Button type="button" variant="outline" onClick={onClose} className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" className="w-1/2" disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
