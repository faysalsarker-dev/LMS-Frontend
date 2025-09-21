import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { BookCheck, Camera, Heart, Lock, LogOut, User, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SingleFileUpload from "@/components/custom/SingleFileUpload"; // Assuming this component exists
import CourseCard from "@/components/custom/CourseCard"; // Placeholder component

import { useUpdateMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";

// Dummy data for a better visual representation
const dummyCourses = [
  { id: 1, title: "Modern JavaScript", instructor: "Jane Doe", imageUrl: "https://images.unsplash.com/photo-1550009158-963d8ed2a3a5?q=80&w=2670&auto=format&fit=crop" },
  { id: 2, title: "React.js for Beginners", instructor: "John Smith", imageUrl: "https://images.unsplash.com/photo-1549490349-866d0c2688f8?q=80&w=2574&auto=format&fit=crop" },
  { id: 3, title: "Data Science with Python", instructor: "Alice Johnson", imageUrl: "https://images.unsplash.com/photo-1546410531-bb448666782c?q=80&w=2670&auto=format&fit=crop" },
];

const countries = ["United States", "Canada", "United Kingdom", "Bangladesh", "India", "China"];

const Profile = () => {
  const { data: userInfo, isLoading, error } = useUserInfoQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMutation();
  const [image, setImage] = useState<File | null>(null);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        country: "",
        city: "",
      },
    },
  });

  useEffect(() => {
    if (userInfo?.data) {
      reset({
        name: userInfo.data.name || "",
        email: userInfo.data.email || "",
        phone: userInfo.data.phone || "",
        address: {
          country: userInfo.data.address?.country || "",
          city: userInfo.data.address?.city || "",
        },
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address[country]", data.address.country);
      formData.append("address[city]", data.address.city);
      if (image) formData.append("file", image);

      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      handleApiError(err);
    }
  };

  // State-based loading and error messages
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">
        Error loading profile. Please try again.
      </div>
    );
  }

  if (!userInfo?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No profile data found.
      </div>
    );
  }

  const { name, email, phone, createdAt, address, profile } = userInfo.data;

  return (
    <div className="min-h-screen py-8 bg-background text-foreground">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">My Profile</h1>
        
        {/* Profile Header Card */}
        <Card className="mb-6 bg-card border-border shadow-lg">
          <CardContent className="pt-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <SingleFileUpload
                value={profile || null}
                onChange={(fileOrNull) => setImage(fileOrNull)}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-1">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member Since: {format(new Date(createdAt), "PPP")}
              </p>
            </div>
            <div className="ml-auto mt-4 md:mt-0 flex flex-col items-center">
              <Button variant="outline" className="mb-2 w-full md:w-auto">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary text-secondary-foreground">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-300">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-300">
              <BookCheck className="h-4 w-4 mr-2" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-300">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-300">
              <Lock className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} id="name" />}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input {...field} type="email" id="email" disabled />}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => <Input {...field} id="phone" />}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Controller
                        name="address.country"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Controller
                        name="address.city"
                        control={control}
                        render={({ field }) => <Input {...field} id="city" />}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" type="button" onClick={() => reset()} disabled={isUpdating}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="mt-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookCheck className="h-5 w-5" />
                  My Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You are currently enrolled in these courses.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dummyCourses.map((course) => (
                    <CourseCard key={course.id}  />
                  ))}
                </div>
                {dummyCourses.length === 0 && (
                  <p className="text-center text-muted-foreground">You haven't enrolled in any courses yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="mt-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  My Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Courses you've saved for later.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dummy data for wishlist. Could be fetched from an API */}
                  <CourseCard course={dummyCourses[0]} />
                  <CourseCard course={dummyCourses[2]} />
                </div>
                {dummyCourses.length === 0 && (
                  <p className="text-center text-muted-foreground">Your wishlist is empty.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Manage your account and security settings.</p>
                <Button className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <Button variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

