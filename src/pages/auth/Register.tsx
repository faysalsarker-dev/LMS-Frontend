import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  phone: number;
};

const Register = () => {
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

  const passwordChecks = {
    hasUpper: /[A-Z]/.test(passwordValue),
    hasLower: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
  };

 
  const onSubmit = async (data: FormValues) => {
  try {
    const userInfo = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      phone: data.phone,
    };

    const res = await registerMutation(userInfo).unwrap();

    toast.success(res?.message || "Account created successfully!");

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="animate-fade-in border border-muted shadow-primary/20 shadow-2xl">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName", { required: true })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register("lastName", { required: true })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                    className="pl-10"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    type="phone"
                    placeholder="Enter your phone"
                    {...register("phone", { required: true })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...register("password", { required: true })}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="space-y-1 text-sm mt-2">
                <p
                  className={
                    passwordChecks.hasUpper ? "text-green-600" : "text-red-500"
                  }
                >
                  • At least one uppercase letter
                </p>
                <p
                  className={
                    passwordChecks.hasLower ? "text-green-600" : "text-red-500"
                  }
                >
                  • At least one lowercase letter
                </p>
                <p
                  className={
                    passwordChecks.hasNumber ? "text-green-600" : "text-red-500"
                  }
                >
                  • At least one number
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="bg-primary/10 shadow-2xl"
                    id="agreeToTerms"
                    {...register("agreeToTerms", { required: true })}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Already have account */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
