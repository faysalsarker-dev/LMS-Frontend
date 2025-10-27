import { useCallback, useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, User } from "lucide-react";
import { useUpdateMutation } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";
import type { IUser } from "@/interface";

interface IAddress {
  country: string;
  city: string;
}

interface IFormValues {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
}

interface IEditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: Partial<IUser>;
  refetch: () => void;
}

const DEFAULT_FORM_VALUES: IFormValues = {
  name: "",
  email: "",
  phone: "",
  address: { country: "", city: "" },
};

const COUNTRIES: string[] = [
  "United States",
  "Canada",
  "United Kingdom",
  "Bangladesh",
  "India",
  "China",
  "Australia",
  "Germany",
];

const EditProfileDialog = ({
  open,
  onOpenChange,
  userInfo,
  refetch
}: IEditProfileDialogProps): JSX.Element => {
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const [updateUser, { isLoading }] = useUpdateMutation();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(userInfo?.profile || null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open && userInfo) {
      reset({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: {
          country: userInfo.address?.country || "",
          city: userInfo.address?.city || "",
        },
      });
      setPreview(userInfo.profile || null);
      setProfileImage(null);
    }
  }, [open, userInfo, reset]);

  const handleImageChange = useCallback((file: File | null): void => {
    if (!file) return;
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setProfileImage(null);
    setPreview(userInfo?.profile || null);
  }, [userInfo]);

  const handleProfileUpdate = useCallback(
    async (formValues: IFormValues): Promise<void> => {
      try {
        const fd = new FormData();
        fd.append("name", formValues.name);
        fd.append("phone", formValues.phone || "");
        fd.append("address[country]", formValues.address?.country || "");
        fd.append("address[city]", formValues.address?.city || "");

        if (profileImage) {
          fd.append("profile", profileImage);
        }
const info = {
  id: userInfo?._id,
  payload: fd
}
        const res = await updateUser(info).unwrap();

        if (res?.success) {
          refetch();
          onOpenChange(false);
        }
      } catch (err) {
        handleApiError(err);
      }
    },
    [updateUser, refetch, profileImage, onOpenChange,userInfo?._id]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6 mt-4">
          {/* Profile Image Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-sm">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {profileImage && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 p-1.5 bg-destructive text-white rounded-full shadow-md hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                className="hidden"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                  input?.click();
                }}
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </label>
          </motion.div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="John Doe"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      disabled
                      className="bg-muted/50"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      placeholder="+1 234 567 8900"
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Controller
                  name="address.country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    placeholder="New York"
                    disabled={isLoading}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;