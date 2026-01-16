import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";
import FloatingElements from "@/components/modules/auth/FloatingElements";
import { useLoginMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { toast } from 'react-hot-toast';
import { loginSchema, type LoginFormValues } from "@/schema/auth";
import DemoAccess from "@/components/shared/DemoAccess";



const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const { data, isLoading: isUserLoading } = useUserInfoQuery({});
  const user = data?.data;

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // React Hook Form setup


const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isSubmitting },
} = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
    remember: false,
  },
  mode: "onSubmit",
});


  const rememberValue = watch("remember");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isUserLoading) {
      navigate(-1);
    }
  }, [user, isUserLoading, navigate]);

  // Form submission handler
  // const onSubmit = async (data: LoginFormValues) => {
  //   try {
  //     await login({
  //       email: data.email,
  //       password: data.password,
  //       remember: data.remember,
  //     }).unwrap();

  //     toast.success("Login successful!");
  //     navigate(from, { replace: true });
  //     window.location.reload();
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (err: any) {
  //     console.error("Login error:", err);

  //     const message = err?.data?.message || err?.error || "Something went wrong";

  //     if (message === "Account is not verified") {
  //       return navigate(`/verify-account/${data.email}`);
  //     }

  //     toast.error(message);
  //   }
  // };

const onSubmit = async (data: LoginFormValues) => {
  try {
    await login({
      email: data.email,
      password: data.password,
      remember: data.remember,
    }).unwrap();

    toast.success("Login successful!");
    navigate(from, { replace: true });
    window.location.reload();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Login error:", err);

    const message = err?.data?.message || err?.error || "Something went wrong";

    if (message === "Account is not verified") {
      navigate(`/verify-account/${data.email}`);
      return; // Add return here too
    }

    toast.error(message);
    // The error is already handled, no need to re-throw
    // React Hook Form will automatically reset isSubmitting to false
  }
};






  const inputVariants = {
    focused: { 
      scale: 1.02,
      boxShadow: "0 0 0 3px hsl(168 76% 42% / 0.15)",
    },
    unfocused: { 
      scale: 1,
      boxShadow: "0 0 0 0px transparent",
    },
  };

 

  return (
    <div className="relative min-h-screen flex bg-background overflow-hidden">
      <FloatingElements />
<DemoAccess />
      <div className="w-full flex items-center justify-center p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="glass-card rounded-3xl border-border/50 overflow-hidden">
              <CardHeader className="pb-2">
                <motion.div
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles size={16} className="text-secondary" />
                  <span>Continue where you left off</span>
                </motion.div>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email field */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address
                    </Label>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      animate={focusedField === "email" ? "focused" : "unfocused"}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-all"
                        {...register("email")}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </motion.div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          className="text-sm text-destructive"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Password field */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Password
                    </Label>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      animate={focusedField === "password" ? "focused" : "unfocused"}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-12 pr-12 h-12 rounded-xl border-border/50 bg-muted/30 focus:bg-background transition-all"
                        {...register("password")}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                       
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </motion.div>
                      </button>
                    </motion.div>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p
                          className="text-sm text-destructive"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Remember me + Forgot password */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember"
                        checked={rememberValue}
                        onCheckedChange={(checked) => setValue("remember", checked as boolean)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label 
                        htmlFor="remember" 
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forget-password"
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  {/* Submit button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft transition-all group"
                      disabled={isSubmitting || isLoginLoading}
                    >
                      {isSubmitting || isLoginLoading ? (
                        <motion.div
                          className="flex items-center justify-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Signing In...
                        </motion.div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Sign In
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div
                  className="relative my-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      New to LinguaLearn?
                    </span>
                  </div>
                </motion.div>

                {/* Sign up link */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-foreground hover:text-primary font-medium transition-colors group"
                  >
                    Create an account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </CardContent>
            </Card>

            {/* Terms */}
            <motion.div
              className="mt-6 text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p>
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;