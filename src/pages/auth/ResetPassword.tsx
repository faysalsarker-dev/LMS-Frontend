import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";
import { Lock, ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

type FormValues = {
  email: string;
  newPassword: string;
};

export default function ResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const id = params.get("id");
  const token = params.get("token");

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!id || !token) {
      toast.error("Invalid reset link");
      return;
    }
    try {
      const res = await resetPassword({
        id,
        token,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success(res.message);
      navigate("/login");
    } catch (err) {
      handleApiError(err);
    }
  };

  // Check if link is invalid
  if (!id || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-destructive/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Invalid Reset Link</p>
          <p className="text-sm text-muted-foreground mb-4">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Request New Link
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2 pt-8">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <KeyRound className="w-8 h-8 text-primary" />
              </motion.div>

              <CardTitle className="text-2xl font-bold text-foreground">
                Reset Password
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Create a new secure password for your account.
              </p>
            </CardHeader>

            <CardContent className="pt-6 pb-8 px-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* New Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      {...form.register("newPassword", { required: true })}
                      className="h-12 bg-background border-border/50 focus:border-primary/50 transition-colors pl-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Password Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2 p-3 bg-muted/50 rounded-lg"
                >
                  <p className="text-xs font-medium text-muted-foreground">Password should contain:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      "At least 8 characters",
                      "One uppercase letter",
                      "One lowercase letter",
                      "One number",
                    ].map((req, index) => (
                      <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3" />
                        {req}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Additional Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-border/50 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Protected by industry-standard encryption
        </motion.p>
      </div>
    </div>
  );
}
