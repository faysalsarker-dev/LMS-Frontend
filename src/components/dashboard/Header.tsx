import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor,
  Mail,
  CreditCard,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { Skeleton } from '../ui/skeleton';

const notifications = [
  {
    id: 1,
    title: "New course enrollment",
    description: "Emily Davis enrolled in React Development Course",
    time: "2 hours ago",
    type: "enrollment",
    unread: true
  },
  {
    id: 2,
    title: "Payment received",
    description: "$149.99 from David Wilson",
    time: "5 hours ago",
    type: "payment",
    unread: true
  },
  {
    id: 3,
    title: "Course published",
    description: "Python for Data Science is now live",
    time: "1 day ago",
    type: "course",
    unread: false
  },
  {
    id: 4,
    title: "System maintenance",
    description: "Scheduled maintenance on Sunday 2 AM",
    time: "2 days ago",
    type: "system",
    unread: false
  }
];

export function Header() {
  const { setTheme } = useTheme();
  const {data , isloading} = useUserInfoQuery({})
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-header-border bg-header-glass/95 backdrop-blur-md supports-[backdrop-filter]:bg-header-glass/80">
      <div className="flex h-16 items-center px-6 gap-4 justify-between">
        {/* Left side - Sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1 hover:bg-muted hover:text-foreground transition-colors" />
          
          {/* Breadcrumb or Page Title could go here */}
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
          </div>
        </div>

        {/* Center - Search */}


        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted transition-colors">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse-soft"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover/95 backdrop-blur-sm">
              <DropdownMenuLabel className="font-semibold flex items-center justify-between">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-2 text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={cn(
                      "flex-col items-start p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      notification.unread && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {notification.title}
                          {notification.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center p-3 cursor-pointer">
                <span className="text-sm text-primary font-medium">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

{
isloading ? (
  <Skeleton className='h-10 w-10 rounded-full'/>

): data && (
       <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200">
                <Avatar className="h-10 w-10 ring-2 ring-border">
                  <AvatarImage 
                    src={data?.data?.profile} 
                    alt="Admin Avatar" 
                  />
                  <AvatarFallback className="bg-primary/50 text-white font-semibold">
                    FS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2 p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                        alt="Admin Avatar" 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white font-semibold">
                        FS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{data?.data?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
{
  data?.data?.role
}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {
                          data?.data?.email
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <User className="mr-3 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <Mail className="mr-3 h-4 w-4" />
                <span>Messages</span>
                <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs">3</Badge>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CreditCard className="mr-3 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <Shield className="mr-3 h-4 w-4" />
                <span>Security</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-muted/50 transition-colors">
                <HelpCircle className="mr-3 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

)
}

          {/* User Menu */}
   
        </div>
      </div>
    </header>
  );
}