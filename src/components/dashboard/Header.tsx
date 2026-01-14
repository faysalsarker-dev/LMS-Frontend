import { 
  Search, 

  LogOut, 
  Sun, 
  Moon, 
  Monitor,

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


export function Header() {
  const { setTheme } = useTheme();
  const {data } = useUserInfoQuery(undefined)
const [open,setOpen]=useState<boolean>(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-header-border bg-header-glass/95 backdrop-blur-md supports-[backdrop-filter]:bg-header-glass/80">
      <div className="flex h-16 items-center px-6 gap-4 justify-between">
        {/* Left side - Sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1 hover:bg-muted hover:text-foreground transition-colors" />
          
          {/* Breadcrumb or Page Title could go here */}
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome back, {data?.data?.name}</p>
          </div>
        </div>

        {/* Center - Search */}


        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-muted">
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted transition-colors">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>



{
 data && (
       <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200">
                <Avatar className="h-10 w-10 ring-2 ring-border">
                  <AvatarImage 
                    src={data?.data?.profile} 
                    alt="Admin Avatar" 
                  />
                  <AvatarFallback className="bg-primary/50 text-white font-semibold">
                    FS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2 p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={data?.data?.profile}
                        alt="Admin Avatar" 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white font-semibold">
                        FS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{data?.data?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
{
  data?.data?.role
}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {
                          data?.data?.email
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
         
          
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

)
}

         
   
        </div>
      </div>



<LogoutDialog
  open={open}
  setOpen={setOpen}
/>


    </header>
  );
}