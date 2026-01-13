// import { useState } from "react";
// import { motion } from "framer-motion";
// import {  User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import type { IUser } from "@/interface/user.types";
// import { toast } from "sonner";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface EditProfileDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   userInfo: IUser;
//   onSuccess?: () => void;
// }

// const EditProfileDialog = ({ 
//   open, 
//   onOpenChange, 
//   userInfo,
//   onSuccess 
// }: EditProfileDialogProps) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: userInfo.name || '',
//     email: userInfo.email || '',
//     phone: userInfo.phone || '',
//     address: userInfo.address || '',
//   });

//   const initials = userInfo.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     setIsLoading(false);
//     toast.success('Profile updated successfully!');
//     onSuccess?.();
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg h-[80%]">
//     <ScrollArea className="h-full pr-2 overflow-auto">
// <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
//         </DialogHeader>

//  <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Avatar Section */}
//           <div className="flex justify-center">
//             <motion.div 
//               className="relative group"
//               whileHover={{ scale: 1.02 }}
//             >
//               <Avatar className="w-24 h-24 border-4 border-primary/20">
//                 <AvatarImage src={userInfo.profile} alt={userInfo.name} />
//                 <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="secondary"
//                 className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs rounded-full"
//               >
//                 Change
//               </Button>
//             </motion.div>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name" className="flex items-center gap-2">
//                 <User className="w-4 h-4 text-muted-foreground" />
//                 Full Name
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//                 className="rounded-xl"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email" className="flex items-center gap-2">
//                 <Mail className="w-4 h-4 text-muted-foreground" />
//                 Email Address
//               </Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="rounded-xl"
//                 disabled
//               />
//               <p className="text-xs text-muted-foreground">Email cannot be changed</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone" className="flex items-center gap-2">
//                 <Phone className="w-4 h-4 text-muted-foreground" />
//                 Phone Number
//               </Label>
//               <Input
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your phone number"
//                 className="rounded-xl"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="address" className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-muted-foreground" />
//                 Location
//               </Label>
//               <Input
//                 id="address"
//                 name="address"
//                 value={formData.address.country}
//                 onChange={handleChange}
//                 placeholder="Enter your location"
//                 className="rounded-xl"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="address" className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4 text-muted-foreground" />
//                 Location
//               </Label>
//               <Input
//                 id="address"
//                 name="address"
//                 value={formData.address.city}
//                 onChange={handleChange}
//                 placeholder="Enter your location"
//                 className="rounded-xl"
//               />
//             </div>

          
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               className="rounded-xl"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="rounded-xl gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 'Save Changes'
//               )}
//             </Button>
//           </div>
//         </form>

//     </ScrollArea>


        

       
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditProfileDialog;


import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Loader2, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IUser } from "@/interface/user.types";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateMutation } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: IUser;
  onSuccess?: () => void;
}

// Define the form shape based on your IUser interface
interface ProfileFormValues {
  name: string;
  phone: string;
  address: {
    country: string;
    city: string;
  };
  profileImage?: File;
}

const EditProfileDialog = ({ 
  open, 
  onOpenChange, 
  userInfo,
  onSuccess 
}: EditProfileDialogProps) => {
  const [updateUser, { isLoading }] = useUpdateMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize React Hook Form
  const { register, handleSubmit, setValue } = useForm<ProfileFormValues>({
    defaultValues: {
      name: userInfo.name || "",
      phone: userInfo.phone || "",
      address: {
        country: userInfo.address?.country || "",
        city: userInfo.address?.city || "",
      },
    },
  });

  const initials = userInfo.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file); // Set file in React Hook Form
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const formData = new FormData();
    
    // Append standard fields
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    
    formData.append("address", JSON.stringify(data.address));
    if (data.profileImage) {
      formData.append("file", data.profileImage);
    }

    try {
      await updateUser(formData).unwrap();
      toast.success('Profile updated successfully!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
handleApiError(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg h-[80%]">
        <ScrollArea className="h-full pr-2 overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <motion.div className="relative group" whileHover={{ scale: 1.02 }}>
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={previewUrl || userInfo.profile} alt={userInfo.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-3 h-3 mr-1" /> Change
                </Button>
              </motion.div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" /> Full Name
                </Label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your full name"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                </Label>
                <Input
                  value={userInfo.email}
                  className="rounded-xl bg-muted"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="Enter phone number"
                  className="rounded-xl"
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Country
                  </Label>
                  <Input
                    {...register("address.country")}
                    placeholder="Country"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> City
                  </Label>
                  <Input
                    {...register("address.city")}
                    placeholder="City"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-background pb-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl gap-2 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;