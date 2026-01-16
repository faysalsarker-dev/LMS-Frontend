import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Eye, EyeOff, Phone, BookOpen, Sparkles, Headphones, Globe, MessageCircle, Award, PenTool, GraduationCap, Languages } from "lucide-react";
import AnimatedLines from "@/components/modules/auth/AnimatedLines";
import FloatingLetter from "@/components/modules/auth/FloatingLetter";
import FloatingIcon from "@/components/modules/auth/FloatingIcon";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/errorHandler";
import { useTranslation } from "react-i18next";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  phone: string;
};



const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [registerMutation] = useRegisterMutation();
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const passwordValue = watch("password", "");

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!passwordValue) return { score: 0, label: "", color: "" };
    
    let score = 0;
    if (passwordValue.length >= 6) score += 1;
    if (passwordValue.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[a-z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    
    if (score <= 2) return { score: 1, label: t("auth.register.weak"), color: "bg-destructive" };
    if (score <= 4) return { score: 2, label: t("auth.register.medium"), color: "bg-accent" };
    return { score: 3, label: t("auth.register.strong"), color: "bg-success" };
  }, [passwordValue]);


    const onSubmit = async (data: FormValues) => {
  try {
    const userInfo = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      phone: data.phone,
    };

    const res = await registerMutation(userInfo).unwrap();

    toast.success(res?.message || t("auth.accountCreated"));

    if (res?.success) {
      return navigate(`/verify-account/${data.email}`);
    }
  } catch (err: unknown) {
    const apiError = err as { data?: { message?: string } };

    if (apiError?.data?.message === "Account is not verified") {
      return navigate(`/verify-account/${data.email}`);
    }

    handleApiError(err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative px-4 py-12">
      {/* Animated background */}
      <AnimatedLines />
      
      {/* Decorative blurred shapes */}
      <motion.div 
        className="absolute w-64 h-64 bg-primary/10 rounded-full top-10 left-10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute w-48 h-48 bg-accent/15 rounded-full bottom-20 right-10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute w-40 h-40 bg-primary/10 rounded-full top-1/3 right-1/4 blur-2xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 5, delay: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating letters - ABC */}
      <FloatingLetter className="text-7xl lg:text-9xl text-primary/15 top-8 left-4 lg:left-16" delay={0} duration={6}>A</FloatingLetter>
      <FloatingLetter className="text-5xl lg:text-7xl text-accent/20 top-16 right-8 lg:right-24" delay={0.5} duration={5}>B</FloatingLetter>
      <FloatingLetter className="text-6xl lg:text-8xl text-primary/10 bottom-20 left-8 lg:left-32" delay={1} duration={7}>C</FloatingLetter>
      <FloatingLetter className="text-4xl lg:text-6xl text-accent/15 bottom-40 right-12 lg:right-20" delay={1.5} duration={5.5}>D</FloatingLetter>
      <FloatingLetter className="text-5xl lg:text-7xl text-primary/12 top-1/3 left-4 lg:left-8" delay={2} duration={6.5}>E</FloatingLetter>

      {/* Floating letters - Chinese */}
      <FloatingLetter className="text-5xl lg:text-7xl text-primary/15 top-32 lg:top-24 left-1/4" delay={0.3} duration={5.5}>你</FloatingLetter>
      <FloatingLetter className="text-4xl lg:text-6xl text-accent/20 bottom-16 right-1/4" delay={0.8} duration={6}>好</FloatingLetter>
      <FloatingLetter className="text-5xl lg:text-6xl text-primary/12 top-1/2 right-4 lg:right-12" delay={1.3} duration={5}>学</FloatingLetter>
      <FloatingLetter className="text-4xl lg:text-5xl text-accent/15 bottom-1/3 left-8 lg:left-16" delay={1.8} duration={6.5}>习</FloatingLetter>

      {/* Floating Icons */}
      <FloatingIcon icon={Headphones} className="top-20 right-16 lg:right-1/3" size={40} delay={0.2} duration={5} />
      <FloatingIcon icon={Globe} className="bottom-32 left-16 lg:left-1/4" size={36} delay={0.7} duration={6} />
      <FloatingIcon icon={MessageCircle} className="top-1/3 right-8 lg:right-16" size={32} delay={1.2} duration={5.5} />
      <FloatingIcon icon={Award} className="bottom-48 right-1/3" size={38} delay={1.7} duration={6.5} />
      <FloatingIcon icon={PenTool} className="top-48 left-8 lg:left-20" size={30} delay={2.2} duration={5} />
      <FloatingIcon icon={GraduationCap} className="bottom-24 left-1/3" size={42} delay={0.4} duration={5.8} />
      <FloatingIcon icon={Languages} className="top-12 left-1/3 lg:left-1/2" size={35} delay={0.9} duration={6.2} />
      <FloatingIcon icon={BookOpen} className="bottom-1/4 right-8 lg:right-24" size={34} delay={1.4} duration={5.3} />

      {/* Centered Form */}
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
    

        {/* Card */}
        <motion.div 
          className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t("auth.register.createYourAccount")}</h2>
            <p className="text-muted-foreground text-sm">{t("auth.register.startJourney")}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First + Last Name */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">{t("auth.register.firstName")}</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="firstName"
                    placeholder={t("auth.register.firstNamePlaceholder")}
                    {...register("firstName", { required: true })}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">{t("auth.register.lastName")}</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                  <Input
                    id="lastName"
                    placeholder={t("auth.register.lastNamePlaceholder")}
                    {...register("lastName", { required: true })}
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Label htmlFor="email" className="text-sm font-medium">{t("auth.email")}</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  {...register("email", { required: true })}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              <Label htmlFor="phone" className="text-sm font-medium">{t("auth.register.phoneNumber")}</Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("auth.register.phonePlaceholder")}
                  {...register("phone", { required: true })}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Label htmlFor="password" className="text-sm font-medium">{t("auth.password")}</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  {...register("password", { required: true })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {passwordValue && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((level) => (
                      <motion.div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : "bg-muted"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: level * 0.1 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium transition-colors ${
                      passwordStrength.score === 1 ? "text-destructive" :
                      passwordStrength.score === 2 ? "text-accent" :
                      passwordStrength.score === 3 ? "text-success" : "text-muted-foreground"
                    }`}>
                      {passwordStrength.label || t("auth.register.enterPassword")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {passwordValue.length} {t("auth.register.characters")}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div 
              className="flex items-start space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            >
              <Checkbox
                id="agreeToTerms"
                className="mt-0.5"
                {...register("agreeToTerms", { required: true })}
              />
              <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                {t("auth.register.agreeToTerms")}{" "}
                <Link to="/terms" className="text-primary hover:underline font-medium">
                  {t("auth.termsOfService")}
                </Link>{" "}
                {t("auth.and")}{" "}
                <Link to="/privacy" className="text-primary hover:underline font-medium">
                  {t("auth.privacyPolicy")}
                </Link>
              </Label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <motion.div 
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    {t("auth.register.creatingAccount")}
                  </> 
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t("auth.register.createFreeAccount")}
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Already have account */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <span className="text-muted-foreground text-sm">{t("auth.register.alreadyHaveAccount")} </span>
            <Link to="/login" className="text-primary hover:underline font-medium text-sm">
              {t("auth.register.signInLink")}
            </Link>
          </motion.div>

     
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
