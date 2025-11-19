import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Input,
} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

// API hooks
import { useCreatePromoMutation } from "@/redux/features/promo/promo.api";
import { useGetAllQuery } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";

interface CreatePromoFormData {
  code: string;
  description: string;
  discountValue: number;
  discountType: "percentage" | "fixed";
  maxUsageCount: number | null;
  maxUsagePerUser: number;
  minOrderAmount: number;
  isActive: boolean;
  validFrom: string;
  expirationDate: string;
}

const CreatePromoModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState<string | null>(null);

  const { data: rowDataOfUser, refetch } = useGetAllQuery(
    { search },
    { skip: !search }
  );

  const foundUser = rowDataOfUser?.data?.data[0];

  const [createPromo, { isLoading }] = useCreatePromoMutation();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<CreatePromoFormData>({
      defaultValues: {
        discountType: "percentage",
        isActive: true,
        maxUsageCount: null,
        maxUsagePerUser: 1,
        minOrderAmount: 0,
        validFrom: new Date().toISOString().split("T")[0],
        expirationDate: new Date().toISOString().split("T")[0],
      },
    });

  const discountType = watch("discountType");
  const validFrom = watch("validFrom");
  const expirationDate = watch("expirationDate");
  const isActive = watch("isActive");

  // Search user
  const handleSearchUser = async () => {
    if (!searchInput) return;
    setSearch(searchInput);
    const res = await refetch();
    if (res?.data?.data?.data?.length) {
      toast.success("User found!");
    } else {
      toast.error("User not found!");
    }
  };

  const onSubmit = async (data: CreatePromoFormData) => {
    if (!foundUser?._id) return toast.error("Please find a user first!");

    try {
      await createPromo({ ...data, createdBy: foundUser._id }).unwrap();
      toast.success("Promo created successfully!");
      reset();
      setOpen(false);
    } catch (err) {

handleApiError(err)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] overflow-auto h-[80%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Promo Code
          </DialogTitle>
          <DialogDescription>
            First, search & attach a user.
          </DialogDescription>
        </DialogHeader>

        {/* Search Section */}
        <div className="bg-muted/40 p-4 rounded-xl space-y-3 border">
          <div className="flex gap-2">
            <Input
              placeholder="Search by email or phone"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button onClick={handleSearchUser}>Search</Button>
          </div>

          {foundUser && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 font-medium"
            >
              ✅ {foundUser.name || foundUser.email} found!
            </motion.p>
          )}
        </div>

        {/* Promo Form */}
        {foundUser && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 mt-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Code */}
            <div className="space-y-2">
              <Label>Promo Code</Label>
              <Input
                placeholder="E.g., SAVE20"
                {...register("code", { required: "Code is required" })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Short description"
                {...register("description", { required: true })}
              />
            </div>

            {/* Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={discountType}
                  onValueChange={(v) =>
                    setValue("discountType", v as "percentage" | "fixed")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                  placeholder={
                    discountType === "percentage" ? "e.g., 10%" : "e.g., $20"
                  }
                  {...register("discountValue", { min: 1 })}
                />
              </div>
            </div>

            {/* Usage limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Max Total Uses</Label>
                <Input
                  type="number"
                  placeholder="Unlimited if empty"
                  {...register("maxUsageCount")}
                />
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
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !validFrom && "text-muted-foreground"
                      )}
                    >
                      {validFrom
                        ? format(new Date(validFrom), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={validFrom ? new Date(validFrom) : undefined}
                      onSelect={(date) =>
                        date && setValue("validFrom", date.toISOString().split("T")[0])
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expirationDate && "text-muted-foreground"
                      )}
                    >
                      {expirationDate
                        ? format(new Date(expirationDate), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={
                        expirationDate ? new Date(expirationDate) : undefined
                      }
                      onSelect={(date) =>
                        date && setValue("expirationDate", date.toISOString().split("T")[0])
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Order + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Order Amount</Label>
                <Input type="number" {...register("minOrderAmount")} />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={isActive ? "active" : "inactive"}
                  onValueChange={(v) =>
                    setValue("isActive", v === "active")
                  }
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
            <div className="flex gap-3 pt-2 justify-between items-center w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-1/2"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-1/2" disabled={isLoading}>
                Create Promo
              </Button>
            </div>
          </motion.form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePromoModal;
