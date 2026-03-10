import { Outlet, ScrollRestoration } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentMobileNavbar } from "@/components/student/AppBar";
import { Header } from "@/components/dashboard/Header";

const StudentLayout = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background transition-colors duration-300">
                <StudentSidebar />
                <div className="flex-1 flex flex-col overflow-hidden mb-16 md:mb-0">
                    <Header />
                    <main className="flex-1 overflow-auto bg-muted/5">
                        <Outlet />
                         <ScrollRestoration />
                    </main>
                </div>
                <StudentMobileNavbar />
            </div>
        </SidebarProvider>
    );
};

export default StudentLayout;