import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, BookOpen, Heart, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { CoursesTab, LogoutDialog, PersonalInfoTab, ProfileHeader, ProfilePageSkeleton, ProfileStats, SettingsTab, WishlistTab } from "@/components/modules/profile";
import EditProfileDialog from "@/components/modules/profile/EditProfileDialog";
import { useGetMyEnrolledCoursesQuery, useGetMyWishlistCoursesQuery } from "@/redux/features/course/course.api";

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

const tabConfig = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'courses', label: 'Courses', icon: BookOpen },
  { value: 'wishlist', label: 'Wishlist', icon: Heart },
  { value: 'settings', label: 'Settings', icon: Settings },
];

const ProfilePage = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const dispatch = useAppDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data, isLoading, refetch } = useUserInfoQuery(undefined);

  const { data: enrolledCourses,isLoading:isCourseLoading } = useGetMyEnrolledCoursesQuery(undefined);
  const {data:wishlistData,isLoading:isWishlistData}=useGetMyWishlistCoursesQuery(undefined)

  const userInfo = useMemo(() => data?.data, [data]);
  const courses = useMemo(() => enrolledCourses?.data || [], [enrolledCourses]);
  const wishlist = useMemo(() => wishlistData?.data || [], [wishlistData]);


  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
    setLogoutDialogOpen(false);
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">User not found</h2>
          <p className="text-muted-foreground">Please try logging in again.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container mx-auto max-w-6xl px-4 py-8 space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account, courses, and preferences
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <ProfileHeader
          userInfo={userInfo}
          onEditClick={() => setEditDialogOpen(true)}
          onLogoutClick={() => setLogoutDialogOpen(true)}
        />

        {/* Stats */}
        <ProfileStats
          enrolledCourses={courses.length}
          wishlistCount={wishlist.length}
        
        />

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-muted/50 p-1 gap-1 flex-wrap">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <PersonalInfoTab userInfo={userInfo} />
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <CoursesTab courses={courses} isLoading={isCourseLoading} />
            </TabsContent>

            <TabsContent value="wishlist" className="mt-6">
              <WishlistTab wishlist={wishlist} isLoading={isWishlistData} />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Dialogs */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        userInfo={userInfo}
        onSuccess={refetch}
      />

      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
};

export default ProfilePage;
