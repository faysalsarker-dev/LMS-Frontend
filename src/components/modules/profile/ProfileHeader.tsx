import { motion } from "framer-motion";
import { format } from "date-fns";
import { Edit2, LogOut, Mail, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { IUser } from "@/interface/user.types";

interface ProfileHeaderProps {
  userInfo: IUser;
  onEditClick: () => void;
  onLogoutClick: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const ProfileHeader = ({ userInfo, onEditClick, onLogoutClick }: ProfileHeaderProps) => {
  const { name, email, createdAt, profile, role } = userInfo;
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-primary/5 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full translate-y-24 -translate-x-24" />
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Avatar Section */}
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <Avatar className="w-32 h-32 border-4 border-background shadow-2xl relative">
                <AvatarImage src={profile} alt={name} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEditClick}
              >
                <Edit2 className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {name}
                  </h2>
                  {role && (
                    <Badge variant="secondary" className="capitalize">
                      <Shield className="w-3 h-3 mr-1" />
                      {role}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {email}
                  </span>
                  <span className="hidden sm:block text-muted-foreground/50">•</span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since {format(new Date(createdAt), "MMMM yyyy")}
                  </span>
                </div>
              </div>

              {/* Bio placeholder */}
              <p className="text-muted-foreground max-w-lg">
                Welcome back! Continue your learning journey and achieve your goals.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onEditClick}
                className="gap-2 rounded-xl border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                onClick={onLogoutClick}
                className="gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
