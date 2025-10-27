
import { useState,  useMemo, type JSX } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MyCourseCard from "@/components/modules/profile/MyCourseCard";
import AvatarUpload from "@/components/modules/profile/AvatarUpload";
import CourseCard from "@/components/modules/Course/CourseCard";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import type { ICourse, IUser } from "@/interface";
import SettingsTab from "@/components/modules/profile/SettingsTab";
import PersonalInfoTab from "@/components/modules/profile/PersonalInfoTab";
import EditProfileDialog from "@/components/modules/profile/EditProfileDialog";
import { useAppDispatch } from "@/redux/hooks";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';







interface IProfileHeaderProps {
  userInfo: IUser;
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 }
  }
};

// Empty State Component
const EmptyState = ({ message }: IEmptyStateProps): JSX.Element => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center py-16"
  >
    <p className="text-muted-foreground text-lg">{message}</p>
  </motion.div>
);

// Profile Header Component
const ProfileHeader = ({ userInfo, onEditClick }: IProfileHeaderProps): JSX.Element => {
  const { name, email, createdAt } = userInfo;

  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-8 overflow-hidden border-0 shadow-lg pt-0">
        <div className="h-40 bg-gradient-primary relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        </div>
        <CardContent className="pt-0 flex flex-col md:flex-row items-center md:items-start gap-6 -mt-16 relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <AvatarUpload
              imageUrl={userInfo.profile}
              onImageChange={() => {}}
            />
          </motion.div>
          <div className="text-center md:text-left flex-1 mt-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <div>
                <h2 className="text-3xl font-bold  text-foreground">{name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {format(new Date(createdAt), "MMMM yyyy")}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEditClick}
                  className="p-2 hover:bg-primary/10"
                  aria-label="Edit profile"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0"
          >
            <Button variant="outline" className="gap-2 shadow-sm hover:shadow-md transition-shadow">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Courses Tab
const CoursesTab = ({ courses, isLoading }: ICoursesTabProps): JSX.Element => {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl">My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses?.length ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {courses?.map((course: ICourse) => (
                <motion.div
                  key={course._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <MyCourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <BookCheck className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg">You haven't enrolled in any courses yet.</p>
              <p className="text-sm mt-2">Start learning today!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Wishlist Tab
const WishlistTab = ({ wishlist, isLoading }: IWishlistTabProps): JSX.Element => {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          {wishlist?.length ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {wishlist.map((course) => (
                <motion.div
                  key={course._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg">Your wishlist is empty.</p>
              <p className="text-sm mt-2">Save courses you're interested in!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Profile = (): JSX.Element => {
  const { data, isLoading, refetch } = useUserInfoQuery({
    includeCourses: true,
    includeWishlist: true,
  });

console.log(data);

      const [logout] = useLogoutMutation();
const [open,setOpen]=useState(false)



  const dispatch = useAppDispatch();


   const handleLogout = async () => {
       await logout(undefined);
    dispatch(authApi.util.resetApiState());
   }


  const [dialogOpen, setDialogOpen] = useState(false);

  const userInfo = useMemo(() => data?.data, [data]);
  const courses = useMemo(() => userInfo?.courses || [], [userInfo]);
  const wishlist = useMemo(() => userInfo?.wishList || [], [userInfo]);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-subtle">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!userInfo) {
    return <EmptyState message="No profile data found." />;
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gradient-subtle">
      <motion.div
        className="container mx-auto px-4 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account and preferences
          </p>
        </motion.div>

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
refetch={refetch}
/>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid  w-full grid-cols-4  mb-8 bg-card/50 backdrop-blur-sm p-1.5 rounded-xl shadow-md h-14">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 flex justify-center items-center flex-col md:flex-row py-1 gap-2"
              >
                <User className="h-4 w-4 mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 flex justify-center items-center flex-col md:flex-row py-1 gap-2"
              >
                <BookCheck className="h-4 w-4 " /> Courses
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 flex justify-center items-center flex-col md:flex-row py-1 gap-2"
              >
                <Heart className="h-4 w-4 " /> Wishlist
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300  flex justify-center items-center flex-col md:flex-row py-1 "
              >
                <Lock className="h-4 w-4 " /> Settings
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
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>


<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


    </div>
  );
};

export default Profile;
