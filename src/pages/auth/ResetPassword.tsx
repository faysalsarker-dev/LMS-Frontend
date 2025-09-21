import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import { handleApiError } from "@/utils/errorHandler";


type FormValues = {
  email: string;
  newPassword:string

};

export default function ResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const id = params.get("id");
  const token = params.get("token");

  const form = useForm<FormValues>({
    defaultValues:{
      email:"",
      newPassword:''
    }
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


    handleApiError(err);    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-primary/30">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-primary">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              {...form.register("newPassword")}
            />
       
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
