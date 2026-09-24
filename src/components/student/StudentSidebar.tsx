import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
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
  useSidebar
} from "@/components/ui/sidebar";

export function StudentSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { open } = useSidebar();
  

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-bg transition-all duration-300">
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
                      {open && <span>{t(route.name)}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>


    </Sidebar>
  );
}
