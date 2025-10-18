import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { BookCheck, Heart, Lock, LogOut, User, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MyCourseCard from "@/components/modules/profile/MyCourseCard";
import AvatarUpload from "@/components/modules/profile/AvatarUpload";
import { useUpdateMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";






const countries = ["United States", "Canada", "United Kingdom", "Bangladesh", "India", "China", "Australia", "Germany"];

const Profile = () => {
const [updateUser]=useUpdateMutation()
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {data , isloading} = useUserInfoQuery(undefined)
  console.log(data,'data');
  const userInfo = data?.data
const course = data?.data.course



  const { control, handleSubmit, reset, formState: { isDirty } } = useForm({
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

  const handleImageChange = (file: File) => {
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form data:", data);
      console.log("Profile image:", profileImage);
      // Handle form submission here
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Handle logout
  };

  const handleResetPassword = () => {
    console.log("Reset password...");
    // Handle password reset
  };

  const handleDeleteAccount = () => {
    console.log("Delete account...");
    // Handle account deletion
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!userInfo?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No profile data found.</p>
      </div>
    );
  }

  const { name, email, createdAt, address } = userInfo;

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and course preferences</p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-8 shadow-card border-border overflow-hidden animate-scale-in">
          <div className="h-32 bg-gradient-primary" />
          <CardContent className="pt-0 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 md:-mt-12">
              <AvatarUpload
                imageUrl={previewUrl}
                onImageChange={handleImageChange}
              />
              <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
                <h2 className="text-3xl font-bold mb-2">{name}</h2>
                <p className="text-muted-foreground mb-1">{email}</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                  <span>Member since {format(new Date(createdAt), "MMMM yyyy")}</span>
                </p>
              </div>
              <div className="md:mt-8">
                <Button onClick={handleLogout} variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="profile" className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-muted/50 p-1">
            <TabsTrigger 
              value="profile" 
              className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <BookCheck className="h-4 w-4" />
              <span className="hidden sm:inline">My Courses</span>
            </TabsTrigger>
            <TabsTrigger 
              value="wishlist"
              className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription>Update your profile details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            id="name" 
                            placeholder="Enter your full name"
                            className="transition-all focus:ring-2 focus:ring-primary"
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            type="email" 
                            id="email" 
                            disabled 
                            className="bg-muted cursor-not-allowed"
                          />
                        )}
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input 
                          {...field} 
                          id="phone" 
                          placeholder="+1 (555) 000-0000"
                          className="transition-all focus:ring-2 focus:ring-primary"
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Controller
                        name="address.country"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
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
                        render={({ field }) => (
                          <Input 
                            {...field} 
                            id="city" 
                            placeholder="Enter your city"
                            className="transition-all focus:ring-2 focus:ring-primary"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => {
                        reset();
                        setPreviewUrl(userInfo.data.profile);
                      }} 
                      disabled={isUpdating || !isDirty}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isUpdating || !isDirty}
                      className="bg-gradient-primary hover:opacity-90 transition-opacity"
                    >
                      {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookCheck className="h-6 w-6 text-primary" />
                  My Enrolled Courses
                </CardTitle>
                <CardDescription>
                  Track your learning progress across {dummyCourses.length} courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dummyCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyCourses.map((course) => (
                      <MyCourseCard key={course.id} course={course} showProgress />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
                    <Button className="mt-4 bg-gradient-primary">Browse Courses</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="h-6 w-6 text-secondary" />
                  My Wishlist
                </CardTitle>
                <CardDescription>
                  Courses you've saved for later learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistCourses.map((course) => (
                      <MyCourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Your wishlist is empty.</p>
                    <Button className="mt-4 bg-gradient-primary">Explore Courses</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="shadow-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Lock className="h-6 w-6 text-accent" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold mb-1">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <Button onClick={handleResetPassword} className="bg-gradient-primary">
                      Reset Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-destructive flex items-center gap-2">
                    <Trash2 className="h-6 w-6" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                    <div>
                      <h3 className="font-semibold mb-1 text-destructive">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button 
                      onClick={handleDeleteAccount} 
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
