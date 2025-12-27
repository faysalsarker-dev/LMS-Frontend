import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Mail, ArrowLeft, RefreshCw } from "lucide-react";

// ShadCN UI Components
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

// Assuming you have these two mutations in your auth.api.ts
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";
import { Link } from "react-router";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

const useCountdown = (initialCount: number) => {
  const [timer, setTimer] = useState(initialCount);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    if (timer === 0) {
      setIsActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isActive]);

  const resetTimer = useCallback(() => {
    setTimer(initialCount);
    setIsActive(true);
  }, [initialCount]);

  return { timer, resetTimer, isResendActive: !isActive };
};

const maskEmail = (email: string) => {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  const maskedLocalPart =
    localPart.length > 2
      ? `${localPart.substring(0, 2)}${"*".repeat(localPart.length - 2)}`
      : `${localPart.substring(0, 1)}*`;

  return `${maskedLocalPart}@${domain}`;
};

export default function OtpVerify() {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const { timer, resetTimer, isResendActive } = useCountdown(COUNTDOWN_SECONDS);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  // Prevent multiple OTP sends
  const otpSentRef = useRef(false);

  useEffect(() => {
    if (email && !otpSentRef.current) {
      otpSentRef.current = true;
      const promise = sendOtp({ email }).unwrap();
      toast.promise(promise, {
        loading: "Sending OTP...",
        success: "OTP sent successfully to your email!",
        error: "Failed to send OTP. Please try again.",
      });
    }
  }, [email, sendOtp]);

  const handleVerify = useCallback(
    async (currentOtp: string) => {
      if (!email || currentOtp.length !== OTP_LENGTH) return;

      try {
        const data = {
          email,
          otp: currentOtp,
        };

        const result = await verifyOtp(data).unwrap();
        toast.success(result.message || "Verification successful!");
        navigate("/login");
      } catch (error) {
        handleApiError(error);
        setOtp("");
      }
    },
    [email, navigate, verifyOtp]
  );

  const handleResend = async () => {
    if (!email) return;

    try {
      await sendOtp({ email }).unwrap();
      toast.success("A new OTP has been sent.");
      resetTimer();
      setOtp("");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (!email) {
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
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-lg font-medium text-foreground mb-2">Email address not found</p>
          <p className="text-sm text-muted-foreground mb-4">Please check the URL and try again.</p>
          <Link to="/login">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
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
                <ShieldCheck className="w-8 h-8 text-primary" />
              </motion.div>

              <CardTitle className="text-2xl font-bold text-foreground">
                Email Verification
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                Enter the {OTP_LENGTH}-digit code sent to{" "}
                <span className="font-semibold text-foreground">{maskEmail(email)}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 pb-8 px-6">
              {/* OTP Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-6"
              >
                <InputOTP
                  maxLength={OTP_LENGTH}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {[...Array(OTP_LENGTH)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-12 h-14 text-xl font-semibold border-border/50 bg-background rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </motion.div>

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => handleVerify(otp)}
                  disabled={otp.length !== OTP_LENGTH || isVerifyingOtp || isSendingOtp}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Verify Account
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Resend Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-border/50 text-center"
              >
                {isResendActive ? (
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResend}
                      disabled={isSendingOtp}
                      className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
                    >
                      {isSendingOtp ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          Resend
                        </>
                      )}
                    </button>
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-semibold text-muted-foreground">{timer}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can resend the code in <span className="font-medium">{timer}s</span>
                    </p>
                  </div>
                )}
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
