import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, DollarSign, Eye, GraduationCap, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from 'date-fns';

export function StatCard({ 
  title, 
  value, 
  growth, 
  icon: Icon, 
  description
}: { 
  title: string; 
  value: string | number; 
  growth: number; 
  icon: React.ComponentType<{ className?: string }>; 
  description: string;
}) {
  const isPositive = growth > 0;
  const GrowthIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="flex items-center gap-1 text-sm">
          <GrowthIcon className={`h-4 w-4 ${isPositive ? 'text-success' : 'text-destructive'}`} />
          <span className={isPositive ? 'text-success' : 'text-destructive'}>
            {Math.abs(growth)}%
          </span>
          <span className="text-muted-foreground">from last month</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

export function RecentEnrollmentsTable() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Enrollments</CardTitle>
        <CardDescription>Latest course enrollments from students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              student: 'Emily Davis',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
              course: 'Complete React Development Course',
              date: '2 hours ago',
              progress: 15,
              status: 'active'
            },
            {
              student: 'David Wilson',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
              course: 'Python for Data Science',
              date: '5 hours ago',
              progress: 32,
              status: 'active'
            },
            {
              student: 'Lisa Rodriguez',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
              course: 'UI/UX Design Masterclass',
              date: '1 day ago',
              progress: 78,
              status: 'active'
            },
          ].map((enrollment, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={enrollment.avatar} alt={enrollment.student} />
                  <AvatarFallback>{enrollment.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{enrollment.student}</p>
                  <p className="text-sm text-muted-foreground">{enrollment.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                    {enrollment.progress}% progress
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{enrollment.date}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Enrollments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivitiesCard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await mockApi.getRecentActivities();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return GraduationCap;
      case 'course_created': return BookOpen;
      case 'user_registered': return Users;
      case 'payment': return DollarSign;
      default: return Users;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'text-blue-600';
      case 'course_created': return 'text-green-600';
      case 'user_registered': return 'text-purple-600';
      case 'payment': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-secondary ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{' '}
                      <span className="text-muted-foreground">{activity.description}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}