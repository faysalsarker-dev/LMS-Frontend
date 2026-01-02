import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IUser } from "@/interface";

interface PersonalInfoTabProps {
  userInfo: IUser;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <motion.div 
    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
    variants={itemVariants}
  >
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value || 'Not provided'}</p>
    </div>
  </motion.div>
);

export const PersonalInfoTab = ({ userInfo }: PersonalInfoTabProps) => {
  const { name, email, phone, address, createdAt, role } = userInfo;

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Basic Info */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <InfoItem icon={User} label="Full Name" value={name} />
          <InfoItem icon={Mail} label="Email Address" value={email} />
          <InfoItem icon={Phone} label="Phone Number" value={phone} />
          <InfoItem icon={MapPin} label="Location" value={`Country:${address?.country}, City:${address?.city}`} />
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <motion.div 
            className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"
            variants={itemVariants}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Account Type</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {role || 'Student'}
              </Badge>
            </div>
          </motion.div>
          <InfoItem 
            icon={Calendar} 
            label="Member Since" 
            value={createdAt ? format(new Date(createdAt), "MMMM dd, yyyy") : undefined} 
          />
        </CardContent>
      </Card>

    </motion.div>
  );
};
