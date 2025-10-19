import type { IUser } from "@/interface";
import { useCallback, useEffect, useState, type JSX } from "react";
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
import { Loader2 } from "lucide-react";

interface IAddress {
  country: string;
  city: string;
}
interface IFormValues {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
  password: string;
}







interface IEditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: IUser;
  onSubmit: (formValues: IFormValues, profileImage: File | null) => Promise<void>;
  isLoading: boolean;
}



const DEFAULT_FORM_VALUES: IFormValues = {
  name: "",
  email: "",
  phone: "",
  address: { country: "", city: "" },
  password: "",
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
  onSubmit,
  isLoading,
}: IEditProfileDialogProps): JSX.Element => {
  const { control, handleSubmit, reset } = useForm<IFormValues>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

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
        password: "",
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

  const handleFormSubmit = useCallback(
    async (formValues: IFormValues): Promise<void> => {
      await onSubmit(formValues, profileImage);
      onOpenChange(false);
    },
    [onSubmit, profileImage, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal info and profile picture.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
              <div className="flex gap-4 items-start">
                {/* Avatar Preview */}
                <div className="w-28">
                  <Label htmlFor="profile-image" className="mb-2">
                    Profile
                  </Label>
                  <div className="rounded-md overflow-hidden border w-28 h-28 flex items-center justify-center bg-muted">
                    {preview ? (
                      <img
                        src={preview}
                        alt="profile preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground px-2 text-center">
                        No image
                      </div>
                    )}
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e.target.files?.[0] || null)
                    }
                    className="mt-2 text-sm"
                    disabled={isLoading}
                    aria-label="Upload profile image"
                  />
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="name"
                            placeholder="Full name"
                            disabled={isLoading}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="email"
                            disabled
                            className="bg-muted cursor-not-allowed"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="phone"
                            placeholder="+880..."
                            disabled={isLoading}
                          />
                        )}
                      />
                    </div>
                    <div>
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
                              <SelectValue placeholder="Select country" />
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

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Controller
                      name="address.city"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="city"
                          placeholder="City"
                          disabled={isLoading}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">New Password (optional)</Label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="Leave blank to keep current password"
                          disabled={isLoading}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    };


    export default EditProfileDialog