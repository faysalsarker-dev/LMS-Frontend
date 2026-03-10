import { 
  Search, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor,
  Bell,
  Settings,
  User,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/useTheme';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { LogoutDialog } from '../shared/LogoutDialog';
import { useState } from 'react';
import { useLocation, Link } from 'react-router';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { setTheme } = useTheme();
  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);
  const location = useLocation();

  // Generate dynamic breadcrumbs base on path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4 justify-between">
        
        {/* Left Section: Sidebar & Breadcrumbs */}
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <SidebarTrigger className="h-9 w-9 hover:bg-muted transition-colors" />
          
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <Link to="/my-dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            {pathnames.length > 1 && pathnames.slice(1).map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
              const isLast = index === pathnames.length - 2;
              const displayName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              
              return (
                <div key={name} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  {isLast ? (
                    <span className="font-semibold text-foreground">{displayName}</span>
                  ) : (
                    <Link to={routeTo} className="hover:text-primary transition-colors">{displayName}</Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Section: Enhanced Search */}
        <div className="hidden lg:flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            placeholder="Search courses, tests, and more..." 
            className="pl-10 h-10 w-full bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
             <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex items-center gap-1 md:gap-3">
          
          {/* Mobile Search Trigger */}
          <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted rounded-full">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-muted rounded-full transition-all duration-200">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 mt-2 p-1 bg-popover/90 backdrop-blur-md border-border/50">
              <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 rounded-lg cursor-pointer">
                <Sun className="h-4 w-4" /> <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 rounded-lg cursor-pointer">
                <Moon className="h-4 w-4" /> <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 rounded-lg cursor-pointer">
                <Monitor className="h-4 w-4" /> <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-muted rounded-full animate-hover">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px] border-2 border-background">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 mt-2 p-0 bg-popover/95 backdrop-blur-xl border-border/50 overflow-hidden shadow-2xl rounded-2xl">
              <div className="p-4 border-b border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Notifications</h4>
                  <Badge variant="secondary" className="text-[10px]">3 New</Badge>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-4 border-b border-border/30 last:border-0 focus:bg-primary/5 cursor-pointer transition-colors">
                    <div className="flex w-full justify-between items-center gap-2">
                       <span className="font-medium text-sm">New Course Content</span>
                       <span className="text-[10px] text-muted-foreground">2h ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">A new lesson has been added to your React Mastery course. Check it out now!</p>
                  </DropdownMenuItem>
                ))}
              </div>
              <div className="p-2 bg-muted/30">
                <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Menu */}
          {userInfo && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 md:h-11 md:w-auto md:px-2 md:gap-3 rounded-full md:rounded-xl hover:bg-muted transition-all duration-200">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-2 ring-primary/10">
                    <AvatarImage src={userInfo.data.profile} alt={userInfo.data.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {userInfo.data.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-sm font-semibold truncate max-w-[100px]">{userInfo.data.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{userInfo.data.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 p-2 bg-popover/95 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl" align="end">
                <DropdownMenuLabel className="p-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{userInfo.data.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{userInfo.data.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 bg-border/50" />
                <DropdownMenuItem asChild>
                  <Link to="/my-dashboard/profile" className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors">
                    <User className="h-4 w-4 text-primary" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors">
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-border/50" />
                <DropdownMenuItem 
                  onClick={() => setLogoutOpen(true)}
                  className="flex items-center gap-3 p-2 rounded-lg text-destructive focus:bg-destructive/10 cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <LogoutDialog open={logoutOpen} setOpen={setLogoutOpen} />
    </header>
  );
}