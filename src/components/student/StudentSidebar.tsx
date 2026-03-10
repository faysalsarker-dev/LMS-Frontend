import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { studentRoutes } from "@/router/routes/student";
import Logo from "@/components/shared/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

export function StudentSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { data: userInfo } = useUserInfoQuery({});
  

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-bg transition-all duration-300">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full py-4">
          <SidebarMenu className="px-3 space-y-1">
            {studentRoutes.map((route) => {
              const isActive = location.pathname === route.path;
              return (
                <SidebarMenuItem key={route.name}>
                  <SidebarMenuButton
                    size="lg"
                    className={cn(
                      "group relative w-full transition-all duration-200",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-sidebar-hover"
                    )}
                    asChild
                  >
                    <Link to={route.path}>
                      {route.icon && (
                        <route.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      )}
                      {open && <span>{route.name}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3 transition-all", !open && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">{userInfo?.data?.name?.charAt(0)}</span>
            </div>
            {open && (
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate max-w-[120px]">{userInfo?.data?.name}</span>
                <span className="text-xs text-muted-foreground">Student</span>
              </div>
            )}
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
