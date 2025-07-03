'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Menu, X, Home, Phone, User, Building, 
  LayoutDashboard, LogOut, ChevronDown, Info, LucideProps,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { logout } from '@/service/auth';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';


type MenuItemType = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobilePropertiesOpen, setIsMobilePropertiesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const { user, isLoading, setUser } = useUser();

  const placeholderTexts = [
    "Search luxury apartments...",
    "Find your dream home...",
    "Explore commercial spaces...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    console.log('Searching:', searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Searching:', searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsMenuOpen(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const getDashboardUrl = (role: string): string => {
    switch (role) {
      case 'superadmin':
        return '/superAdmin/All-Properties';
      case 'admin':
        return '/admin/dashboard';
      case 'seller':
        return '/seller/dashboard';
      case 'buyer':
        return '/buyer/properties';
      default:
        return '/';
    }
  };


  const mainMenuItems: MenuItemType[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const propertiesSubMenuItems = [
    { name: 'Buy a Home', href: '/buy', description: 'Find your new home to purchase.' },
    { name: 'Rent a Home', href: '/rent', description: 'Discover great properties for rent.' },
  ];

  if (isLoading) {
    return (
      <div className="bg-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="text-blue-600 animate-pulse" />
            <span className="font-bold text-xl">RealEstate Pro</span>
          </div>
          <div className="animate-pulse w-24 h-6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Home className="h-6 w-6 text-white animate-pulse" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RealEstate Pro
                </span>
              </Link>
            </div>
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={placeholderTexts[placeholderIndex]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  {mainMenuItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <Link href={item.href} className={navigationMenuTriggerStyle()}>
                        <item.icon className="h-4 w-4 mr-1" />
                        {item.name}
                      </Link>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Building className="h-4 w-4 mr-1" />
                      Properties
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/properties"
                            >
                              <Building className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                All Properties
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Explore our complete collection of stunning properties.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        {propertiesSubMenuItems.map((item) => (
                          <ListItem key={item.name} title={item.name} href={item.href}>
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <div className="w-4"></div>

              {user?.role ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href={getDashboardUrl(user.role)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
                  >
                    <LayoutDashboard className="h-4 w-4 group-hover:animate-pulse" />
                    <span className="capitalize">{user.role}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden mt-2 space-y-1 pb-4">
              {mainMenuItems.map((item) => (
                <Link key={item.name} href={item.href} className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  <item.icon className="inline-block h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              <div>
                <button
                  onClick={() => setIsMobilePropertiesOpen(!isMobilePropertiesOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-md"
                >
                  <span className="flex items-center">
                    <Building className="inline-block h-5 w-5 mr-3" />
                    Properties
                  </span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isMobilePropertiesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobilePropertiesOpen && (
                  <div className="pl-8 pt-1 space-y-1 border-l-2 border-blue-100 ml-5">
                    <Link href="/properties" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>All Properties</Link>
                    {propertiesSubMenuItems.map((item) => (
                      <Link key={item.name} href={item.href} className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t my-2"></div>
              {user?.role ? (
                <>
                  <Link href={getDashboardUrl(user.role)} className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-md" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="inline-block h-5 w-5 mr-3" />
                    {user.role} Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition rounded-md">
                    <LogOut className="inline-block h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md" onClick={() => setIsMenuOpen(false)}>
                  <User className="inline-block h-5 w-5 mr-3" />
                  Login / Sign Up
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className,title, href, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
           href={href ?? "#"}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";