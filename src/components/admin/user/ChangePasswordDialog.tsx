import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useUpdatePasswordMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { differenceInDays, parseISO } from "date-fns";
import { handleApiError } from "@/utils/errorHandler";
import type { IUser } from "@/interface/user.types";



type ChangePasswordDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: Partial<IUser>;
};

type FormValues = {
  currentPassword: string;
  newPassword: string;
};

export const ChangePasswordDialog = ({
  open,
  setOpen,
  user,
}: ChangePasswordDialogProps) => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();





const lastUpdated = user?.updatedAt
  ? parseISO(user.updatedAt)
  : '';
  const daysSinceUpdate = differenceInDays(new Date(), lastUpdated);
  const canUpdate = daysSinceUpdate >= 7;






  const onSubmit = async (data: FormValues) => {
    if (!canUpdate) {
      toast.error("You can change your password only after 7 days");
      return;
    }

    try {
      await updatePassword(data).unwrap();
      toast.success("Password updated successfully");

      reset();
      setOpen(false);
    } catch (error) {
    handleApiError(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Are you sure you want to change the password for{" "}
            <span className="font-semibold">{user.name}</span>?
          </DialogDescription>
        </DialogHeader>

        {!canUpdate && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            You changed your password recently.  
            Please wait <strong>{7 - daysSinceUpdate}</strong> more days.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              disabled={!canUpdate}
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              disabled={!canUpdate}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canUpdate || isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
