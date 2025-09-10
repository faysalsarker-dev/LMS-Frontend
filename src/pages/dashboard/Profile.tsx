import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Bell, 
  Shield, 
  CreditCard,
  Globe,
  Calendar,
  Award,
  Target,
  Book,
  Languages
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate learner focused on web development and data science. Always excited to learn new technologies.',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    birthDate: '1990-05-15',
    timezone: 'America/Los_Angeles',
    language: 'English'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    courseReminders: true,
    marketingEmails: false,
    publicProfile: true,
    showProgress: true,
    showCertificates: true
  });

  const learningGoals = [
    { id: 1, title: 'Complete 5 courses this quarter', progress: 60, target: 5, current: 3 },
    { id: 2, title: 'Learn 50 hours this month', progress: 75, target: 50, current: 37.5 },
    { id: 3, title: 'Earn 3 certificates', progress: 33, target: 3, current: 1 }
  ];

  const skills = [
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 78 },
    { name: 'Python', level: 65 },
    { name: 'Node.js', level: 70 },
    { name: 'SQL', level: 60 },
    { name: 'Git', level: 80 }
  ];

  const certificates = [
    { name: 'Complete Web Development', issuer: 'EduPlatform', date: '2024-01-15', verified: true },
    { name: 'Advanced JavaScript', issuer: 'EduPlatform', date: '2023-11-20', verified: true },
    { name: 'React Fundamentals', issuer: 'EduPlatform', date: '2023-10-08', verified: false }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="space-y-6">
              {/* Avatar Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-2xl font-bold">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{profile.firstName} {profile.lastName}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                      <Button size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="birthDate"
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {learningGoals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>
                        {goal.current}/{goal.target}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Skills Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                <Button className="w-full" variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {cert.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cert.verified && (
                        <Badge className="bg-success">Verified</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(preferences).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'pushNotifications' && 'Receive push notifications on your device'}
                          {key === 'weeklyDigest' && 'Weekly summary of your learning progress'}
                          {key === 'courseReminders' && 'Reminders to continue your courses'}
                          {key === 'marketingEmails' && 'Promotional emails about new courses and features'}
                        </div>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(preferences).slice(5).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {key === 'publicProfile' && 'Allow others to view your public profile'}
                          {key === 'showProgress' && 'Display your learning progress on profile'}
                          {key === 'showCertificates' && 'Show your certificates on public profile'}
                        </div>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, [key]: checked})
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Language & Region */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Language & Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Español</SelectItem>
                          <SelectItem value="French">Français</SelectItem>
                          <SelectItem value="German">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="Europe/London">GMT</SelectItem>
                          <SelectItem value="Europe/Berlin">CET</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;