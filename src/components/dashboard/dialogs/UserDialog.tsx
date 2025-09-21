import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Shield, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useRegisterMutation, useUpdateMutation } from "@/redux/features/auth/auth.api";
import type { IUser } from "@/interface";
import { handleApiError } from "@/utils/errorHandler";
import { Switch } from "@/components/ui/switch";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode?: "create" | "update";
  user?: IUser | null;
}


type formData = {
     firstName:string;
      lastName: string;
      email: string;
      role: string;
      phone: string;
      password: string;
      isActive:boolean;
      isVerified:boolean

}

export default function UserDialog({ open, onOpenChange, onSuccess, mode = "create", user }: UserDialogProps) {
  const [registerMutation, { isLoading: isCreating }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<formData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      phone: "",
      password: "",
      isActive: true,
      isVerified: false,
    },
  });

  const selectedRole = watch("role");
  const isUpdate = mode === "update";
  const isLoading = isCreating || isUpdating;

  // Reset form when user changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (user && isUpdate) {
        const [firstName = "", lastName = ""] = user.name?.split(" ") || [];
        reset({
          firstName,
          lastName,
          email: user.email,
          role: user.role,
          phone: user.phone || "",
          isActive: user.isActive,
          isVerified: user.isVerified,
        });
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          role: "student",
          phone: "",
          password: "",
          isActive: true,
          isVerified: false,
        });
      }
    }
  }, [open, user, isUpdate, reset]);

  const onSubmit = async (data: formData) => {
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        role: data.role,
        isActive: data.isActive,
        isVerified: data.isVerified,
        ...(isUpdate ? {} : { password: data.password }),
      };

      if (isUpdate && user?._id) {
        await updateUser({ id: user._id, data: payload });
        toast.success("User updated successfully!");
      } else {
        await registerMutation(payload);
        toast.success("User created successfully!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
handleApiError(error)
    }
  };

  const getInitials = (name: string) =>
    name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() || "?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-6 w-6" />
            {isUpdate ? "Update User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? "Update user information and settings below."
              : "Add a new user to your platform. They'll receive login credentials via email."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Avatar Section (Update mode only) */}
          {isUpdate && user && (
            <div className="flex flex-col items-center space-y-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-20 w-20 ring-4 ring-background">
                <AvatarImage src={user.profile} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold">{user.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Blocked"}
                  </Badge>
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4" />
                <h4 className="font-medium">Personal Information</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  {...register("firstName", { required: "First name is required" })}
                  className="bg-background"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  {...register("lastName", { required: "Last name is required" })}
                  className="bg-background"
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4" />
                <h4 className="font-medium">Contact Information</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-background"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  {...register("phone", {
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: "Invalid phone number format",
                    },
                  })}
                  className="bg-background"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role & Security Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4" />
                <h4 className="font-medium">Role & Permissions</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">User Role *</Label>
                <Select
                  onValueChange={(value: IUser['role']) => setValue("role", value)}
                  value={selectedRole}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="instructor">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Instructor
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Password Section (Create mode only) */}
            {!isUpdate && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-4 w-4" />
                  <h4 className="font-medium">Security</h4>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter temporary password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="bg-background"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
               
                </div>
              </div>
            )}
          </div>

          {/* Status & Verification Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4" />
                <h4 className="font-medium">Status Settings</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Account Status</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable or disable user login access
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={watch("isActive")}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isVerified">Email Verification</Label>
                    <p className="text-xs text-muted-foreground">
                      Mark email as verified or unverified
                    </p>
                  </div>
                  <Switch
                    id="isVerified"
                    checked={watch("isVerified")}
                    onCheckedChange={(checked) => setValue("isVerified", checked)}
                  />
                </div>
              </div>
            </div>

            {/* Empty space for layout balance */}
            <div></div>
          </div>

          {/* Enrolled Courses (Update mode only) */}
          {isUpdate && user?.courses && user.courses.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h4 className="font-medium">Enrolled Courses ({user.courses.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:shadow-sm transition-shadow"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.title}</p>
                      <p className="text-xs text-muted-foreground">Course ID: {course._id.slice(-8)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-primary hover:opacity-90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? isUpdate
                  ? "Updating..."
                  : "Creating..."
                : isUpdate
                ? "Update User"
                : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}