import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { IUser } from "@/interface";
import type { JSX } from "react";


interface IPersonalInfoTabProps {
  userInfo: IUser;
}

const PersonalInfoTab = ({ userInfo }: IPersonalInfoTabProps): JSX.Element => {
  const { name, email, phone, address } = userInfo;

  return (
    <Card className="shadow-md border border-border">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-muted-foreground">Full Name</Label>
            <div className="mt-2 font-medium">{name}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <div className="mt-2 font-medium">{email}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Phone</Label>
            <div className="mt-2 font-medium">{phone || "-"}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Address</Label>
            <div className="mt-2 font-medium">
              {address?.city || address?.country
                ? `${address?.city || ""} ${address?.country ? `, ${address.country}` : ""}`
                : "-"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoTab