import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Camera, Lock, ShoppingCart, Edit } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    Address: {
      country: "China",
      city: "Shenzhen",
      street: "Nanshan",
      zip: "518000",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
    // ideally reset to original values if you fetch from API
  };

  const handleSave = () => {
    console.log("Saved:", profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
    


         <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    <h3 className="font-semibold mb-2">
                      {profile.email} 
                    </h3>
                    <Button size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className=" space-y-6">
            {/* Avatar Section */}
           

            {/* Info Section */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Country</Label>
                        <Input
                          value={profile.Address.country}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              Address: {
                                ...profile.Address,
                                country: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={profile.Address.city}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              Address: {
                                ...profile.Address,
                                city: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p>
                      <strong>Name:</strong> {profile.firstName}{" "}
                      {profile.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {profile.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {profile.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {profile.Address.street},{" "}
                      {profile.Address.city}, {profile.Address.country} -{" "}
                      {profile.Address.zip}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent value="purchases" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Purchases History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  View all your purchased courses
                </p>
                <Button>Go to Purchases</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
