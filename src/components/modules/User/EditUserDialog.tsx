import  { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useUpdateMutation } from "@/redux/features/auth/auth.api";


interface UserUpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userData: any; // user object from DB
}

export default function UserUpdateDialog({ open, setOpen, userData }: UserUpdateDialogProps) {
  const [updateUser, { isLoading }] = useUpdateMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "student",
      isActive: true,
      isVerified: false,
      country: "",
      city: "",
      courses: [],
      profile: "",
    },
  });

  // Reset form when userData changes
  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData?.name?.split(" ")[0] || "",
        lastName: userData?.name?.split(" ")[1] || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        role: userData?.role || "student",
        isActive: userData?.isActive,
        isVerified: userData?.isVerified,
        country: userData?.address?.country || "",
        city: userData?.address?.city || "",
        courses: userData?.courses?.map((c: any) => c._id) || [],
        profile: userData?.profile || "",
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
      address: {
        country: data.country,
        city: data.city,
      },
    };

    delete payload.firstName;
    delete payload.lastName;

    try {
      await updateUser({ id: userData._id, ...payload }).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Update User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input {...register("firstName", { required: true })} />
              {errors.firstName && <span className="text-red-500 text-sm">Required</span>}
            </div>
            <div>
              <Label>Last Name</Label>
              <Input {...register("lastName", { required: true })} />
              {errors.lastName && <span className="text-red-500 text-sm">Required</span>}
            </div>
          </div>

          {/* Email / Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} disabled />
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("phone", { required: true })} />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <Select
              onValueChange={(val) => setValue("role", val)}
              defaultValue={userData?.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("isActive")} defaultChecked={userData?.isActive} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("isVerified")} defaultChecked={userData?.isVerified} />
              <Label>Verified</Label>
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-4">
            {userData?.profile && (
              <img
                src={userData.profile}
                alt="profile"
                className="w-16 h-16 rounded-full border"
              />
            )}
            <div className="flex-1">
              <Label>Profile Image</Label>
              <Input type="file" accept="image/*" {...register("profile")} />
            </div>
          </div>

          {/* Courses */}
          <div>
            <Label>Courses</Label>
            <select
              {...register("courses")}
              multiple
              className="w-full border rounded-md p-2"
            >
              {/* {coursesData?.map((course: any) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))} */}
            </select>
          </div>

          {/* Address */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Country</Label>
              <Input {...register("country")} />
            </div>
            <div>
              <Label>City</Label>
              <Input {...register("city")} />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" className="w-32" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
