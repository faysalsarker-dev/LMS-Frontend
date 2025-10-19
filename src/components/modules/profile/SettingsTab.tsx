import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsTab = () => {
  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Password</h3>
            <p className="text-sm text-muted-foreground">
              Update your password regularly.
            </p>
          </div>
          <Button variant="outline" className="bg-primary text-white">
            Reset Password
          </Button>
        </div>

        <div className="p-4 border border-destructive/40 bg-destructive/5 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-destructive">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              This action is irreversible.
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab