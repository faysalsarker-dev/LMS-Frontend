import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Sun,
  ChevronRight,
  Shield,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Notifications */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <SettingItem
            icon={Mail}
            title="Email Notifications"
            description="Receive updates about your courses via email"
            action={
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            }
          />
          <SettingItem
            icon={Bell}
            title="Push Notifications"
            description="Get notified about new lessons and announcements"
            action={
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
              />
            }
          />
        </CardContent>
      </Card>

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
            icon={darkMode ? Moon : Sun}
            title="Dark Mode"
            description="Toggle dark mode appearance"
            action={
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
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
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
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
              className="w-full justify-between p-4 h-auto rounded-xl hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your password regularly</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          </motion.div>
          <Separator />
          <motion.div variants={itemVariants}>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto rounded-xl hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
