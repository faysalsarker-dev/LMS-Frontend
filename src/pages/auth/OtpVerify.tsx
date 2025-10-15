import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

// ShadCN UI Components
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

// Assuming you have these two mutations in your auth.api.ts
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";

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
      otpSentRef.current = true; // ensure only once
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
 otp: currentOtp
        }


        const result = await verifyOtp(data).unwrap();
        toast.success(result.message || "Verification successful!");
        navigate("/");
      } catch (error: any) {
        console.log(error);
        toast.error(error.data?.message || "Invalid OTP. Please try again.");
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
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to resend OTP.");
    }
  };

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Email address not found in URL.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            Enter the {OTP_LENGTH}-digit code sent to <br />
            <span className="font-semibold text-gray-800">{maskEmail(email)}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
            >
              <InputOTPGroup className="gap-2">
                {[...Array(OTP_LENGTH)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-10 text-lg rounded-md bg-primary/10 shadow-2xl"
                    autoFocus={index === 0} // ✅ focus on first input
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={() => handleVerify(otp)}
            disabled={otp.length !== OTP_LENGTH || isVerifyingOtp || isSendingOtp}
            className="w-full h-12 text-base font-semibold"
          >
            {isVerifyingOtp ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Verify Account"
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {isResendActive ? (
              <span>
                Didn't receive the code?{" "}
                <Button
                  variant="link"
                  onClick={handleResend}
                  disabled={isSendingOtp}
                  className="p-0 h-auto font-semibold"
                >
                  {isSendingOtp ? "Sending..." : "Resend"}
                </Button>
              </span>
            ) : (
              <span>
                You can resend the code in <b>{timer}s</b>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
