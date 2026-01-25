import { SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '../../components/dashboard/Header';
import { AppSidebar } from '../../components/dashboard/Sidebar';
import { Outlet, ScrollRestoration } from 'react-router';



export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <Outlet/>
            <ScrollRestoration />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}