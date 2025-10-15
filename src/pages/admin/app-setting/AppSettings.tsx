

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Cloud,
  Mail,
  Shield,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmationDialog } from "@/components/modules/AppSetting/ConfirmationDialog";
import {
  useGetAppSettingsQuery,
  useUpdateAppSettingMutation,
} from "@/redux/features/settings/setting.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function AppSettings() {
  const { data: config, isLoading, error } = useGetAppSettingsQuery(undefined);
  const [updateConfig, { isLoading: isUpdating }] =
    useUpdateAppSettingMutation();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCloudinarySecret, setShowCloudinarySecret] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      cloudinary: { cloudName: "", apiKey: "", apiSecret: "" },
      smtp: { host: "", port: 587, user: "", pass: "" },
      jwt: { accessExpiresIn: "", refreshExpiresIn: "" },
      frontendUrl: "",
      maintenanceMode: false,
    },
  });

  // When API data loads, populate the form
  useEffect(() => {
    if (config?.data) {
      reset(config.data);
    }
  }, [config, reset]);

  const onSubmit = async (data: any) => {
    try {
const id = data?._id
        await updateConfig({id , data}).unwrap();
      toast.success("Settings saved successfully!", {
        icon: "✓",
        style: {
          borderRadius: "12px",
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
      });
      setShowConfirmDialog(false);
    } catch (err) {
        console.log(err);
      toast.error("Failed to save settings. Please try again.", {
        icon: "✕",
        style: {
          borderRadius: "12px",
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Error Loading Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Failed to load application settings. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const values = watch();

  return (
    <>
      <form
        onSubmit={handleSubmit(() => setShowConfirmDialog(true))}
        className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <SettingsIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">App Settings</h1>
                <p className="text-muted-foreground">
                  Manage your application configuration and integrations
                </p>
              </div>
            </div>
          </div>

          {/* Cloudinary Settings */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Cloud className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Cloudinary Settings</CardTitle>
                  <CardDescription>Configure your Cloudinary integration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Cloud Name</Label>
                  <Input {...register("cloudinary.cloudName")} placeholder="my-cloud" />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input {...register("cloudinary.apiKey")} placeholder="123456789" />
                </div>
              </div>
              <div>
                <Label>API Secret</Label>
                <div className="relative">
                  <Input
                    type={showCloudinarySecret ? "text" : "password"}
                    {...register("cloudinary.apiSecret")}
                    placeholder="Enter API secret"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCloudinarySecret(!showCloudinarySecret)}
                  >
                    {showCloudinarySecret ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMTP Settings */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>SMTP Settings</CardTitle>
                  <CardDescription>Configure your email server</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>SMTP Host</Label>
                  <Input {...register("smtp.host")} placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label>SMTP Port</Label>
                  <Input
                    type="number"
                    {...register("smtp.port", { valueAsNumber: true })}
                    placeholder="587"
                  />
                </div>
              </div>
              <div>
                <Label>SMTP User</Label>
                <Input {...register("smtp.user")} placeholder="admin@example.com" />
              </div>
              <div>
                <Label>SMTP Password</Label>
                <div className="relative">
                  <Input
                    type={showSmtpPass ? "text" : "password"}
                    {...register("smtp.pass")}
                    placeholder="Enter password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                  >
                    {showSmtpPass ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JWT Config */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>JWT Configuration</CardTitle>
                  <CardDescription>Set token expiration times</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Access Token Expiry</Label>
                  <Input {...register("jwt.accessExpiresIn")} placeholder="15m" />
                </div>
                <div>
                  <Label>Refresh Token Expiry</Label>
                  <Input {...register("jwt.refreshExpiresIn")} placeholder="7d" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Global application configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Frontend URL</Label>
                <Input
                  type="url"
                  {...register("frontendUrl")}
                  placeholder="https://example.com"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable maintenance mode
                  </p>
                </div>
                <Switch
                  checked={values.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setValue("maintenanceMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => reset(config?.data)}
              disabled={isUpdating || !isDirty}
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleSubmit(onSubmit)}
        title="Confirm Settings Update"
        description="Are you sure you want to save these changes? This will update your application configuration."
        confirmText="Save Changes"
      />
    </>
  );
}
