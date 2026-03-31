import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, LayoutDashboard, TrainTrack } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { LogoutDialog } from "./LogoutDialog";
import { toggleLanguage, getCurrentLanguage } from "@/utils/language";
import { UserRoles } from "@/interface/user.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Header = () => {
  const location = useLocation();
  const { data: userInfo } = useUserInfoQuery({});
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(
    getCurrentLanguage(i18n),
  );

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const baseLang = lng.split("-")[0];
      setCurrentLang(baseLang === "zh" ? "zh" : "en");
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const handleLanguageToggle = () => {
    toggleLanguage(i18n);
  };

  const [open, setOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  const navigation = [
    { name: t("navbar.home"), href: "/" },
    { name: t("navbar.courses"), href: "/courses" },
    { name: t("navbar.about"), href: "/About-us" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const role = userInfo?.data?.role;

  const dashboardPath =
    role === UserRoles.SUPER_ADMIN
      ? "/dashboard"
      : role === UserRoles.ADMIN
        ? "/dashboard/users"
        : role === UserRoles.INSTRUCTOR
          ? "/dashboard/courses"
          : null;

  return (
    <header className="bg-card backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}

          <Logo />

          {/* Desktop Navigation */}
          <NavigationMenu className="h-full *:h-full max-md:hidden absolute left-1/2 -translate-x-1/2">
            <NavigationMenuList className="h-full gap-2">
              {navigation.map((link, index) => (
                <NavigationMenuItem key={index} className="h-full">
                  <NavigationMenuLink
                    asChild
                    active={isActive(link.href)}
                    className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary data-[active]:text-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                  >
                    <Link to={link.href}>{link.name}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {userInfo?.data && (
                <NavigationMenuItem className="h-full">
                  <NavigationMenuLink
                    active={isActive(`/my-dashboard`)}
                    asChild
                    className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary data-[active]:text-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                  >
                    <Link to={`/my-dashboard`}>{t("navbar.myDashboard")} </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="font-medium"
            >
              {currentLang.toUpperCase()}
            </Button>

            {userInfo?.data ? (
            





              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-2 ring-primary/10">
                    <AvatarImage src={userInfo.data.profile} alt={userInfo.data.name} />
                    <AvatarFallback className="bg-gradient-primary text-white flex items-center justify-center font-semibold shadow hover:opacity-90 transition">
                       {userInfo?.data?.name
                   ?.split(" ")
                       .map((n: string) => n[0])
                       .join("")
                      .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>{t("navbar.myAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-dashboard/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> {t("navbar.profile")}
                    </Link>
                  </DropdownMenuItem>

                  {userInfo?.data && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/my-dashboard"
                          className="flex items-center gap-2"
                        >
                          <TrainTrack className="w-4 h-4" />{" "}
                          {t("navbar.myDashboard")}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {dashboardPath && (
                    <DropdownMenuItem asChild>
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />{" "}
                        {t("navbar.dashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setOpen(!open)}
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> {t("navbar.logOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t("navbar.logIn")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-primary">
                    {t("navbar.signUp")}
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
                    <Logo />
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
                          {t("navbar.profile")}
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setOpen(!open)}
                        variant="destructive"
                        className="w-full"
                      >
                        {t("navbar.logOut")}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          {t("navbar.logIn")}
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full bg-gradient-primary">
                          {t("navbar.signUp")}
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

      <LogoutDialog open={open} setOpen={setOpen} />
    </header>
  );
};
