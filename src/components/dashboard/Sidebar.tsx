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
import { ScrollArea } from "../ui/scroll-area";

import logo from "../../assets/arow.jpg";
import developer from "../../assets/arow.jpg";

// ✅ Import Lucide icons
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  Tags,
  Settings,
} from "lucide-react";
import { adminRoutes } from "@/router/allRoutes";




export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Header */}
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-10 w-10 rounded-lg" />

            {open && (
              <div className="text-left leading-tight">
                <h1 className="font-bold text-primary">BONIK JEWELLERS</h1>
                <p className="text-xs text-gray-500">Shonjib Bonik</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto my-4">
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminRoutes.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          size="lg"
                          className={`${
                            isActive
                              ? "bg-primary/95 text-white font-extrabold"
                              : "text-gray-700 hover:bg-primary/90"
                          }`}
                          asChild
                        >
                          <Link to={item.path}>
                            {/* <item.icon
                              className="w-5 h-5"
                            /> */}
                            <span
                              className={`${
                                isActive ? "font-bold" : "font-medium"
                              }`}
                            >
                              {item.name}
                            </span>
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
        <div className="shrink-0 border-t border-gray-300">
          <SidebarFooter className="my-4">
            {open ? (
              <a
                href="https://faysal-sarker.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base mt-1 mb-2"
              >
                Developed by{" "}
                <span className="text-blue-500 font-bold">Faysal Sarker</span>
              </a>
            ) : (
              <a
                href="https://faysal-sarker.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={developer}
                  alt="developer"
                  className="h-10 w-10 rounded-lg"
                />
              </a>
            )}
          </SidebarFooter>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
