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
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

import { ExternalLink } from "lucide-react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getRoutesByRole } from "@/router/routeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/shared/Logo";



export function AppSidebar() {
      const { data, isLoading } = useUserInfoQuery({});
  
      const user = data?.data;
      const { t } = useTranslation();

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
        <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
          <div className="flex items-center justify-start w-full">
            {open ? (
              <Logo className="w-full max-w-[140px]" />
            ) : (
              <Logo
                src="/humanistic.png"
                alt="Humanistic icon"
                className="w-full max-w-[40px]"
              />
            )}
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className={`space-y-1 ${open ? "px-2" : "px-0"}`}>



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
                          <Link to={item.path} className="  gap-3">
                      
                              <item.icon
                                className={cn(
                                  "w-6 h-6 transition-colors",
                                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                              />
                      
                            {open && (
                              <span className="font-medium">
                                {t(item.name)}
                              </span>
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


<SidebarFooter className={`${open ? "p-4" : "p-2"} mt-auto border-t border-sidebar-border/50 `}>
  {open ? (
    /* Expanded State: Premium Card Look */
    <div className="group relative overflow-hidden rounded-xl  bg-gradient-to-b from-primary/[0.03] to-transparent px-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center gap-3">
        {/* Logo Container */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center   shadow-sm ">
          <img 
            src="/Developer_faysal_sarker.png" 
            alt="Logo" 
            className="w-full h-full rounded-lg bg-black object-contain transition-transform duration-300 " 
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col truncate">
          <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
            Developed by
          </span>
          <p className="text-sm font-bold text-primary from-foreground to-foreground/70 bg-clip-text ">
            Faysal Sarker
          </p>
        </div>

        {/* Subtle External Link Icon */}
        <a 
          href="https://faysalsarker.me" 
          target="_blank" 
          className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
        </a>
      </div>
    </div>
  ) : (
    /* Collapsed State: Minimalist Icon */
    <div className="flex justify-center">
      <a
        href="https://faysalsarker.me"
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex h-11 w-11 items-center justify-center  bg-background border border-sidebar-border shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
      >
        <img 
          src="/Developer_faysal_sarker.png" 
          alt="FS" 
          className="w-full h-full rounded-lg bg-black  transition-all duration-300 group-hover:grayscale-0 group-hover:scale-110" 
        />
        {/* Tooltip-like effect (Optional) */}
        <span className="absolute left-14 hidden rounded-md bg-zinc-900 px-2 py-1 text-[10px] text-white group-hover:block">
          Faysal
        </span>
      </a>
    </div>
  )}
</SidebarFooter>


      </SidebarContent>
    </Sidebar>
  );
}