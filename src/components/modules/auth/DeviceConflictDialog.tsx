import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {  useLogoutFromOthersMutation } from "@/redux/features/auth/auth.api";

import { handleApiError } from "@/utils/errorHandler";
import { motion } from "framer-motion";
import { Monitor, LogOut, Smartphone, Wifi, WifiOff } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type DeviceConflictDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  email:string
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 15, delay: 0.2 },
  },
};

export const DeviceConflictDialog = ({ open, setOpen , email }: DeviceConflictDialogProps) => {
  const { t } = useTranslation();
  const [logout, { isLoading }] = useLogoutFromOthersMutation();


  const handleLogoutOtherDevice = async () => {
    try {
      await logout({email:email}).unwrap();

      toast.success(t("logout.loggedOutSuccessfully"));

      setOpen(false);
      window.location.reload();
    } catch (error) {
      handleApiError(error);
    }
  };





  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="p-0 border-0 bg-transparent shadow-none max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 border border-border/50 shadow-2xl"
        >
          {/* Decorative blurs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 rounded-full blur-2xl"
            />
          </div>

          <div className="relative p-8">
            {/* Animated icon */}
            <motion.div variants={iconVariants} className="mx-auto mb-6">
              <div className="w-20 h-20 mx-auto relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 p-[2px]"
                >
                  <div className="w-full h-full rounded-full bg-background" />
                </motion.div>

                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-muted/80 to-muted/40 flex items-center justify-center">
                  {/* Two device icons with a conflict line */}
                  <div className="relative flex items-center gap-1">
                    <motion.div
                      animate={{ x: [-2, 2, -2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Monitor className="w-5 h-5 text-amber-500" />
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <WifiOff className="w-4 h-4 text-destructive" />
                    </motion.div>
                    <motion.div
                      animate={{ x: [2, -2, 2] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Smartphone className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Wifi className="w-4 h-4 text-amber-500" />
                </motion.div>
              </div>
            </motion.div>

            <AlertDialogHeader className="space-y-3">
              <motion.div variants={itemVariants}>
                <AlertDialogTitle className="text-2xl font-bold text-center">
                  Session Active Elsewhere
                </AlertDialogTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <AlertDialogDescription className="text-center text-muted-foreground text-base leading-relaxed">
                  This account is already logged in on another device. Please
                  logout from that device first to continue here.
                </AlertDialogDescription>
              </motion.div>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-8 flex-col sm:flex-row gap-3">
              <motion.div variants={itemVariants} className="flex-1">
                <AlertDialogCancel asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 hover:bg-muted/50 transition-all duration-300 font-medium"
                  >
                    Cancel
                  </Button>
                </AlertDialogCancel>
              </motion.div>

              <motion.div variants={itemVariants} className="flex-1">
                <Button
                  onClick={handleLogoutOtherDevice}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 font-medium gap-2 group"
                >
                  <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  Logout Other Device
                </Button>
              </motion.div>
            </AlertDialogFooter>
          </div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
