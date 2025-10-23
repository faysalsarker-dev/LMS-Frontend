import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/arow.jpg";

import {  User } from "lucide-react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getRoutesByRole } from "@/router/routeFilter";
import { Skeleton } from "@/components/ui/skeleton";



export function AppSidebar() {
      const { data, isLoading } = useUserInfoQuery({});
  
      const user = data?.data;



    const allowedRoutes = getRoutesByRole(user?.role);


  
  const location = useLocation();
  const { open } = useSidebar();

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border bg-sidebar-bg transition-all duration-300"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Header */}
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img 
                src={logoImage} 
                alt="EduDashboard Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-lg ring-2 ring-primary/20"
              />
            </div>

            {open && (
              <div className="text-left leading-tight animate-fade-in">
                <h1 className="font-bold text-lg text-foreground">
                  EduDashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Admin Portal
                </p>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-3">



                  {isLoading?
                  
                  
                  
                  
                  
                  
                   Array.from({ length: 6 }).map((_, i) => (
                           
  <SidebarMenuItem key={i}>
                        <SidebarMenuButton
                          size="lg"
                   className=" border-border"
                          asChild
                        >
                        <Skeleton className="w-full h-12"/>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                                ))
                  
                  
                  
                  :
                  allowedRoutes?.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          size="lg"
                          className={cn(
                            "group relative w-full transition-all duration-200 hover-lift",
                            "hover:bg-sidebar-hover hover:shadow-md",
                            isActive && [
                              "bg-primary/20 border border-primary/30",
                              "text-primary font-semibold shadow-md",
                              "route-indicator active"
                            ]
                          )}
                          asChild
                        >
                          <Link to={item.path} className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                            {open && (
                              <span className="font-medium">
                                {item.name}
                              </span>
                            )}
                            {/* Notification badges for specific routes */}
                            {open && item.name === "Messages" && (
                              <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center text-xs p-0">
                                3
                              </Badge>
                            )}
                            {open && item.name === "Students" && (
                              <Badge variant="secondary" className="ml-auto h-5 px-2 text-xs">
                                142
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </div>

        {/* Footer */}
        <SidebarFooter className="border-t border-sidebar-border p-4 mt-auto">
          {open ? (
            <div className="text-center animate-fade-in">
              <p className="text-xs text-muted-foreground">
                Built with 💙 by{" "}
                <a
                  href="https://faysal-sarker.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Faysal Sarker
                </a>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                v2.0.0
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <a
                href="https://faysal-sarker.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <User className="w-4 h-4 text-white" />
              </a>
            </div>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}