import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  CreditCard,
  CheckCircle,
  User,
  Shield
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { IUser } from "@/interface";

interface UserProfileDrawerProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getInitials = (name: string) =>
  name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() || "?";

const getRoleVariant = (role: IUser['role']) => {
  switch (role) {
    case 'admin': return 'destructive';
    case 'instructor': return 'default';
    case 'student': return 'secondary';
    default: return 'secondary';
  }
};

const formatDate = (date: Date | null | undefined) => 
  date ? format(new Date(date), "PPP") : "—";

const formatCurrency = (amount: number | undefined) =>
  amount ? `$${amount.toLocaleString()}` : "$0";

export function UserProfileDrawer({ user, open, onOpenChange }: UserProfileDrawerProps) {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[500px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={user.profile} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </SheetTitle>
          <SheetDescription>
            View and manage user profile information
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge variant={getRoleVariant(user.role)} className="capitalize">
              <Shield className="h-3 w-3 mr-1" />
              {user.role}
            </Badge>
            <Badge variant={user.isActive ? "default" : "destructive"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={user.isVerified ? "default" : "secondary"}>
              {user.isVerified ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </div>
              ) : (
                "Unverified"
              )}
            </Badge>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">Email Address</div>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{user.phone}</div>
                      <div className="text-sm text-muted-foreground">Phone Number</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formatDate(user.createdAt)}</div>
                    <div className="text-sm text-muted-foreground">Member Since</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.role === 'student' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>Courses Enrolled</span>
                      </div>
                      <Badge variant="outline">{ 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Total Spending</span>
                      </div>
                      <div className="font-medium">{32}</div>
                    </div>
                  </>
                ) : user.role === 'instructor' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>Courses Created</span>
                      </div>
                      <Badge variant="outline">{234}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Total Earnings</span>
                      </div>
                      <div className="font-medium">{3243}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Course statistics not applicable for administrators
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Enrolled Courses (for students) */}
          {user.role === 'student' && user.courses && user.courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.courses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {course.thumbnail && (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Course ID: {course._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Separator className="my-6" />
            <div className="flex flex-col gap-3">
              <Button variant="default" className="w-full">
                Edit User Details
              </Button>
              <Button variant="outline" className="w-full">
                Reset Password
              </Button>
              <Button 
                variant={user.isActive ? "destructive" : "default"} 
                className="w-full"
              >
                {user.isActive ? "Suspend Account" : "Activate Account"}
              </Button>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}