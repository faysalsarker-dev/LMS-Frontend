import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  PlayCircle, 
  Calendar,
  Target,
  Star,
  Users,
  ArrowRight
} from 'lucide-react';
import { mockCourses } from '@/data/mockData';

const Dashboard = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    coursesCompleted: 12,
    coursesInProgress: 3,
    totalHours: 156,
    certificates: 8,
    streak: 7
  };

  const enrolledCourses = mockCourses.slice(0, 3).map(course => ({
    ...course,
    progress: Math.floor(Math.random() * 100),
    lastAccessed: Math.floor(Math.random() * 7) + 1
  }));

  const achievements = [
    { title: "First Course Complete", description: "Completed your first course", icon: "🎯", earned: true },
    { title: "Week Warrior", description: "7-day learning streak", icon: "🔥", earned: true },
    { title: "Knowledge Seeker", description: "Enrolled in 5+ courses", icon: "📚", earned: true },
    { title: "Certificate Collector", description: "Earned 10 certificates", icon: "🏆", earned: false }
  ];

  const stats = [
    { 
      title: "Courses in Progress", 
      value: user.coursesInProgress, 
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      change: "+2 this month"
    },
    { 
      title: "Hours Learned", 
      value: user.totalHours, 
      icon: <Clock className="h-5 w-5 text-secondary" />,
      change: "+12 this week"
    },
    { 
      title: "Certificates Earned", 
      value: user.certificates, 
      icon: <Award className="h-5 w-5 text-success" />,
      change: "+1 this month"
    },
    { 
      title: "Learning Streak", 
      value: `${user.streak} days`, 
      icon: <TrendingUp className="h-5 w-5 text-warning" />,
      change: "Keep it up!"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey? Let's pick up where you left off.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {stat.icon}
                  <span className="text-sm text-muted-foreground">{stat.title}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.map((course, index) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-12 bg-gradient-card rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary/60">{course.category.charAt(0)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Last accessed {course.lastAccessed} day{course.lastAccessed !== 1 ? 's' : ''} ago
                        </p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <Badge variant="outline">{course.level}</Badge>
                        </div>
                        
                        <Link to={`/learn/${course.id}`}>
                          <Button size="sm" className="w-full sm:w-auto">
                            Continue Course
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <Link to="/dashboard/my-courses">
                    <Button variant="outline" className="w-full">
                      View All My Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/courses">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Courses
                    </Button>
                  </Link>
                  <Link to="/dashboard/my-courses">
                    <Button variant="outline" className="w-full justify-start">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      My Learning
                    </Button>
                  </Link>
                  <Link to="/dashboard/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="mr-2 h-4 w-4" />
                      Learning Goals
                    </Button>
                  </Link>
                  <Link to="/dashboard/transactions">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Purchase History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  This Week's Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-primary">5/7</div>
                  <div className="text-sm text-muted-foreground">Days completed</div>
                </div>
                
                <Progress value={(5/7) * 100} className="mb-3" />
                
                <div className="text-sm text-muted-foreground text-center">
                  Great job! You're on track to reach your weekly goal.
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-2 rounded-lg ${achievement.earned ? 'bg-muted/50' : 'opacity-50'}`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                      {achievement.earned && (
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCourses.slice(3, 5).map((course) => (
                    <div key={course.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{course.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-secondary" />
                          {course.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students.toLocaleString()}
                        </div>
                      </div>
                      <div className="font-bold text-sm">${course.price}</div>
                    </div>
                  ))}
                </div>
                
                <Link to="/courses">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Browse More Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;