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
import { motion } from "framer-motion";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { handleApiError } from "@/utils/errorHandler";
import { useAppDispatch } from "@/redux/hooks";
import { LogOut, DoorOpen, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

type LogoutDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

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

const doorVariants = {
  closed: { rotateY: 0 },
  open: { rotateY: -30 },
};

export const LogoutDialog = ({ open, setOpen }: LogoutDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout(undefined);
      dispatch(authApi.util.resetApiState());

      toast.success(t("logout.loggedOutSuccessfully"));

      setOpen(false);
      navigate("/", { replace: true });
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
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-2xl"
            />
          </div>

          <div className="relative p-8">
            {/* Animated Icon Section */}
            <motion.div
              variants={iconVariants}
              className="mx-auto mb-6 relative"
            >
              <div className="w-20 h-20 mx-auto relative">
                {/* Outer ring with gradient */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-[2px]"
                >
                  <div className="w-full h-full rounded-full bg-background" />
                </motion.div>

                {/* Inner icon container */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm flex items-center justify-center">
                  <motion.div
                    variants={doorVariants}
                    initial="closed"
                    animate="open"
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    style={{ transformOrigin: "left center", perspective: 100 }}
                  >
                    <DoorOpen className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>

                {/* Floating sparkles */}
                <motion.div
                  animate={{
                    y: [-2, 2, -2],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-secondary" />
                </motion.div>
              </div>
            </motion.div>

            <AlertDialogHeader className="space-y-3">
              <motion.div variants={itemVariants}>
                <AlertDialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {t("logout.leavingSoSoon")}
                </AlertDialogTitle>
              </motion.div>

              <motion.div variants={itemVariants}>
                <AlertDialogDescription className="text-center text-muted-foreground text-base leading-relaxed">
                  {t("logout.signOutMessage")}
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
                    {t("logout.stayAndLearn")}
                  </Button>
                </AlertDialogCancel>
              </motion.div>

              <motion.div variants={itemVariants} className="flex-1">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 transition-all duration-300 font-medium gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                      </motion.div>
                      {t("logout.signingOut")}
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      {t("logout.signOut")}
                    </>
                  )}
                </Button>
              </motion.div>
            </AlertDialogFooter>
          </div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
