import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Lock, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";
import { ChangePasswordDialog } from "../User/ChangePasswordDialog";
import type { IUser } from "@/interface/user.types";

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action: React.ReactNode;
}

const SettingItem = ({ icon: Icon, title, description, action }: SettingItemProps) => (
  <motion.div 
    className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors"
    variants={itemVariants}
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    {action}
  </motion.div>
);

type SettingsTabProps = {
  user: Partial<IUser>;
};

export const SettingsTab = ({ user }: SettingsTabProps) => {
  

 const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
const [open, setOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);


 if (!mounted) return null;

  const isDark = theme === "dark";


  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Notifications */}
 

      {/* Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-primary" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <SettingItem
            icon={isDark ? Moon : Sun}
            title={isDark ? "Dark Mode" : "Light Mode"}
            description={`Currently using ${isDark ? "dark" : "light"} theme`}
            action={
              <Switch
                checked={isDark}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            }
          />
          <SettingItem
            icon={Globe}
            title="Language"
            description="Choose your preferred language"
            action={
              <Select defaultValue="en">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>

                </SelectContent>
              </Select>
            }
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <motion.div variants={itemVariants}>
            <Button 
              variant="ghost" 
onClick={()=>setOpen(true)}
              className="w-full justify-between p-4 h-auto rounded-xl hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left" >
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your password regularly</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>


<ChangePasswordDialog
  open={open}
  setOpen={setOpen}
  user={user}
/>


    </motion.div>
  );
};
