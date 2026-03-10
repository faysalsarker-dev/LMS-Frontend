import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { studentRoutes } from "@/router/routes/student";

export function StudentMobileNavbar() {
  const location = useLocation();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {studentRoutes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.name}
              to={route.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {route.icon && (
                <route.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
              )}
              <span className="text-[10px] font-medium">{route.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
