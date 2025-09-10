import { Link, useLocation } from 'react-router';
import { Home, BookOpen, BarChart3, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileAppBar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  if (!isMobile) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};