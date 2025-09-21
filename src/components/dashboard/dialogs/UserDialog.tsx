"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { handleApiError } from "@/utils/errorHandler";
import { useRegisterMutation,useUpdateMutation } from "@/redux/features/auth/auth.api";
// import { Image } from "@/components/ui/image"; 

type UserRole = "student" | "instructor" | "admin";

type BaseUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  password?: string;
};

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode?: "create" | "update";
  user?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    image?: string;
    courses?: { _id: string; title: string; thumbnail?: string }[];
  };
}

export function UserDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "create",
  user,
}: UserDialogProps) {
  const [registerMutation, { isLoading: isCreating }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BaseUserFormData>({
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
      email: user?.email || "",
      role: user?.role || "student",
      phone: user?.phone || "",
    },
  });

  const selectedRole = watch("role");
  const isUpdate = mode === "update";
  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: BaseUserFormData) => {
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        role: data.role,
        ...(isUpdate
          ? {}
          : { password: data.password, isVerified: true }),
      };

      if (isUpdate && user?._id) {
        await updateUser({ id: user._id, data: payload }).unwrap();
        toast.success("User updated successfully!");
      } else {
        await registerMutation(payload).unwrap();
        toast.success("User created successfully!");
      }

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:w-[600px] md:w-[720px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            {isUpdate ? "Update User" : "Create User"}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {isUpdate
              ? "Update user information below."
              : "Add a new user to the system. They’ll get login credentials automatically."}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-auto py-6 px-4"
        >
          {/* User Image */}
          {isUpdate && user?.image && (
            <div className="flex flex-col items-center mb-6">
              <img
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Current profile image
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                className="bg-card"
                placeholder="First name..."
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                className="bg-card"
                placeholder="Last name..."
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="bg-card"
                placeholder="example@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="bg-card"
                placeholder="Phone number..."
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value: UserRole) => setValue("role", value)}
                value={selectedRole}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            {/* Password (Only in create mode) */}
            {!isUpdate && (
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-card"
                  placeholder="Enter temporary password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Courses (Update mode only) */}
          {isUpdate && user?.courses && user.courses.length > 0 && (
            <div className="mt-6">
              <Label>Enrolled Courses</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {user.courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-3 border p-3 rounded-lg bg-card shadow-sm"
                  >
                    {course.thumbnail && (
                      <img
                        src={course?.thumbnail}
                        alt={course.title}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    )}
                    <p className="text-sm font-medium">{course.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <SheetFooter className="flex justify-end gap-3 border-t mt-8 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? isUpdate
                  ? "Updating..."
                  : "Creating..."
                : isUpdate
                ? "Update User"
                : "Create User"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
