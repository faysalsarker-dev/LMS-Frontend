import {  useState, useCallback, useMemo, type JSX } from "react";

import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  BookCheck,
  Heart,
  Lock,
  LogOut,
  Loader2,
  User,
  Edit2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import MyCourseCard from "@/components/modules/profile/MyCourseCard";
import AvatarUpload from "@/components/modules/profile/AvatarUpload";
import CourseCard from "@/components/modules/Course/CourseCard";
import {
  useUpdateMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import type { ICourse } from "@/interface";
import { handleApiError } from "@/utils/errorHandler";
import SettingsTab from "@/components/modules/profile/SettingsTab";
import PersonalInfoTab from "@/components/modules/profile/PersonalInfoTab";
import EditProfileDialog from "@/components/modules/profile/EditProfileDialog";



interface IAddress {
  country: string;
  city: string;
}

interface IUserInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profile?: string;
  address?: IAddress;
  courses: ICourse[];
  wishList: ICourse[];
  createdAt: string;
  updatedAt?: string;
}

interface IFormValues {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
  password: string;
}



interface IProfileHeaderProps {
  userInfo: IUserInfo;
  onEditClick: () => void;
}




interface ICoursesTabProps {
  courses: ICourse[];
  isLoading: boolean;
}

interface IWishlistTabProps {
  wishlist: ICourse[];
  isLoading: boolean;
}



interface IEmptyStateProps {
  message: string;
}









// Empty State Component
const EmptyState = ({ message }: IEmptyStateProps): JSX.Element => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-muted-foreground">{message}</p>
  </div>
);

// Profile Header Component
const ProfileHeader = ({ userInfo, onEditClick }: IProfileHeaderProps): JSX.Element => {
  const { name, email, createdAt } = userInfo;

  return (
    <Card className="mb-8 shadow-md border border-border pt-0 rounded-2xl">
      <div className="h-32 bg-primary rounded-t-2xl" />
      <CardContent className=" pt-0 flex flex-col md:flex-row items-center gap-6">
        <AvatarUpload
          imageUrl={userInfo.profile}
          onImageChange={() => {}}
        />
        <div className="text-center md:text-left flex-1">
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {format(new Date(createdAt), "MMMM yyyy")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditClick}
              className="p-2"
              aria-label="Edit profile"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </CardContent>
    </Card>
  );
};




// Courses Tab
const CoursesTab = ({ courses, isLoading }: ICoursesTabProps): JSX.Element => {
  if (isLoading) {
    return (
      <Card className="shadow-md border border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {courses?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course : ICourse) => (
              <MyCourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            You haven't enrolled in any courses yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Wishlist Tab
const WishlistTab = ({ wishlist, isLoading }: IWishlistTabProps): JSX.Element => {
  if (isLoading) {
    return (
      <Card className="shadow-md border border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle>Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        {wishlist?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            Your wishlist is empty.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Settings Tab


const Profile = (): JSX.Element => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateMutation();
const { data, isLoading, refetch } = useUserInfoQuery({
  includeCourses: true,
  includeWishlist: true,
});


  const [dialogOpen, setDialogOpen] = useState(false);
  
  const userInfo = useMemo(() => data?.data, [data]);
  const courses = useMemo(() => userInfo?.courses || [], [userInfo]);
  const wishlist = useMemo(() => userInfo?.wishList || [], [userInfo]);
  
  // Handle profile update
  const handleProfileUpdate = useCallback(
    async (formValues: IFormValues, profileImage: File | null): Promise<void> => {
      try {
        const fd = new FormData();
        fd.append("name", formValues.name);
        fd.append("phone", formValues.phone || "");
        fd.append("address[country]", formValues.address?.country || "");
        fd.append("address[city]", formValues.address?.city || "");

        if (profileImage) {
          fd.append("profile", profileImage);
        }

        const res = await updateUser(fd).unwrap();

        if (res?.success) {
          toast.success("Profile updated successfully!");
          refetch();
        } 
      } catch (err) {
handleApiError(err)
      }
    },
    [updateUser, refetch]
  );



  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
    );
  }

  if (!userInfo) {
    return <EmptyState message="No profile data found." />;
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card */}
        <ProfileHeader
          userInfo={userInfo}
          onEditClick={() => setDialogOpen(true)}
        />

        {/* Edit Dialog */}
        <EditProfileDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userInfo={userInfo}
          onSubmit={handleProfileUpdate}
          isLoading={isUpdating}
        />

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-1" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <BookCheck className="h-4 w-4 mr-1" /> Courses
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-1" /> Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Lock className="h-4 w-4 mr-1" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <PersonalInfoTab userInfo={userInfo} />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab courses={courses} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="wishlist">
            <WishlistTab wishlist={wishlist} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab/>









          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;