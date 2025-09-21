import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleApiError } from "@/utils/errorHandler";
import { useForgetPasswordMutation } from "@/redux/features/auth/auth.api";


type FormValues = {
  email: string;

};

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgetPasswordMutation();

  const form = useForm<FormValues>({
    defaultValues:{
      email:""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await forgotPassword({ email: data.email }).unwrap();
      toast.success(res.message);
    } catch (err) {

    

    handleApiError(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-primary/30">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-primary">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              {...form.register("email")}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
