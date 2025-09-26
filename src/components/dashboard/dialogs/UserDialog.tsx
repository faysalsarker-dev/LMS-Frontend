

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Shield, Lock, Phone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { IUser } from "@/interface";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode?: "create" | "update";
  user?: IUser | null;
  isLoading?: boolean;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
}

export default function UserDialog({ open, onOpenChange, onSuccess, mode = "create", user ,isLoading }: UserDialogProps) {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
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

  const onSubmit = async (data: FormData) => {
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

      // Handle form submission here
      console.log("Form data:", payload);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getInitials = (name: string) =>
    name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() || "?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
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
              <motion.div 
                className="flex flex-col items-center space-y-3 p-4 bg-muted/50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                  <AvatarImage src={user.profile} alt={user.name} />
                  <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={user.isVerified ? "default" : "secondary"}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            )}

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Personal Information</h4>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    {...register("firstName", { required: "First name is required" })}
                    className="bg-background transition-all duration-300 focus:shadow-elegant"
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
                    className="bg-background transition-all duration-300 focus:shadow-elegant"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-primary" />
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
                    className="bg-background transition-all duration-300 focus:shadow-elegant"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                      className="pl-10 bg-background transition-all duration-300 focus:shadow-elegant"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Role & Security Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Role & Permissions</h4>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    onValueChange={(value: IUser['role']) => setValue("role", value)}
                    value={selectedRole}
                  >
                    <SelectTrigger className="bg-background transition-all duration-300 hover:shadow-card">
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div>
                            <div className="font-medium">Student</div>
                            <div className="text-xs text-muted-foreground">Can enroll in courses</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="instructor">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <div className="font-medium">Instructor</div>
                            <div className="text-xs text-muted-foreground">Can create and teach courses</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div>
                            <div className="font-medium">Administrator</div>
                            <div className="text-xs text-muted-foreground">Full platform access</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role.message}</p>
                  )}
                </div>
              </motion.div>

              {/* Password Section (Create mode only) */}
              {!isUpdate && (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-primary" />
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
                      className="bg-background transition-all duration-300 focus:shadow-elegant"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      User will be prompted to change password on first login
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Status & Verification Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Separator />
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Account Settings</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" className="font-medium">Account Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable user login access
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={watch("isActive")}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isVerified" className="font-medium">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
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
            </motion.div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
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
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 shadow-elegant"
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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}