import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  User,
  LogOut,
  LayoutDashboard,
  BookOpenText,
} from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { authApi, useLogoutMutation, useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';
import Logo from './Logo';

export const Header = () => {
  const location = useLocation();
   const { data: userInfo } = useUserInfoQuery({});




      const [logout] = useLogoutMutation();
const [open,setOpen]=useState(false)



  const dispatch = useAppDispatch();


   const handleLogout = async () => {
       await logout(undefined);
    dispatch(authApi.util.resetApiState());
   }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;


  return (
    <header className="bg-card backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
         
     

            <Logo/>
         

          {/* Desktop Navigation */}
          <NavigationMenu className="h-full *:h-full max-md:hidden">
            <NavigationMenuList className="h-full gap-2">
              {navigation.map((link, index) => (
                <NavigationMenuItem key={index} className="h-full">
          
                         <NavigationMenuLink asChild
                    active={isActive(link.href)}
                 
                    className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary data-[active]:text-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                  >
                            <Link
                  to={link.href}
                  >
                    {link.name}
                     </Link>
                  </NavigationMenuLink>
                 
           
                </NavigationMenuItem>
              ))}

{
  userInfo?.data && (
      <NavigationMenuItem className="h-full">
             
                         <NavigationMenuLink
                    active={isActive(`/my-courses`)}
                  asChild
                    className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary data-[active]:text-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                  >
     <Link
                  to={`/my-courses`}
                  >


                    My Courses </Link>
                  </NavigationMenuLink>
                 
           
                </NavigationMenuItem>
  )
}

            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {userInfo?.data ? (
              // Avatar Dropdown (like Udemy)
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-gradient-primary text-white flex items-center justify-center font-semibold shadow hover:opacity-90 transition">
                         {userInfo?.data?.name?.split(" ").map((n:string) => n[0]).join("").toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

          {
  userInfo?.data && (
    <DropdownMenuItem asChild>
      <Link to="/my-courses" className="flex items-center gap-2">
        <BookOpenText  className="w-4 h-4" /> My Courses
      </Link>
    </DropdownMenuItem>
  )
}

              
          {
  (userInfo?.data?.role === 'admin' ||
    userInfo?.data?.role === 'super_admin' ||
    userInfo?.data?.role === 'instructor') && (
    <DropdownMenuItem asChild>
      <Link to="/dashboard" className="flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </Link>
    </DropdownMenuItem>
  )
}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>setOpen(!open)} className="text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu - Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                   <Logo/>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-3 px-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      
                      className={`px-2 py-2 rounded-md font-medium ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6">
                  {userInfo?.data ? (
                    <div className="flex flex-col gap-2">
                      <Link to="/dashboard/profile">
                        <Button variant="outline" className="w-full">
                          Profile
                        </Button>
                      </Link>
                      <Button onClick={()=>setOpen(!open)} variant="destructive" className="w-full">
                        Log Out
                      </Button>



                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full bg-gradient-primary">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>











<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will Logout  your account
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>




    </header>
  );
};
