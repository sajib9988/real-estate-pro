"use client";

import * as React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Users,
  User,
  Home,
  FileText,
  LayoutDashboard,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  PlusCircle,
  Heart,
  Calendar,
  UserCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type UserRole = "superadmin" | "admin" | "seller" | "buyer";

interface SidebarMenuItemType {
  title: string;
  url?: string;
  icon?: React.ElementType;
  children?: SidebarMenuItemType[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: UserRole;
}

const menuByRole: Record<UserRole, SidebarMenuItemType[]> = {
  superadmin: [
    { title: "Manage Admins", url: "/superAdmin/Manage Admins", icon: Users },
    { title: "Manage Sellers", url: "/superAdmin/Manage Sellers", icon: User },
    { title: "Manage Buyers", url: "/superAdmin/Manage Buyers", icon: User },
    { title: "All Properties", url: "/superAdmin/All Properties", icon: Home },
    { title: "Reports", url: "/superAdmin/Reports", icon: FileText },
  ],
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Buyers", url: "/admin/buyers", icon: Users },
    { title: "Sellers", url: "/admin/sellers", icon: Users },
    {
      title: "Properties",
      icon: Building,
      children: [
        { title: "Pending", url: "/admin/properties/pending", icon: Clock },
        { title: "Approved", url: "/admin/properties/approved", icon: CheckCircle },
        { title: "Rejected", url: "/admin/properties/rejected", icon: XCircle },
      ],
    },
  ],
  seller: [
    { title: "Dashboard", url: "/seller/dashboard", icon: LayoutDashboard },
    { title: "Add Property", url: "/seller/properties/add", icon: PlusCircle },
    { title: "Buyer Messages", url: "/seller/messages", icon: MessageSquare },
  ],
  buyer: [
    { title: "Browse Properties", url: "/buyer/properties", icon: Building },
    { title: "Favorites", url: "/buyer/favorities", icon: Heart },
    { title: "Add Inquiry", url: "/buyer/inquiries/add", icon: PlusCircle },
    { title: "Schedule Visit", url: "/buyer/visit", icon: Calendar },
    { title: "Profile", url: "/buyer/profile", icon: UserCog },
  ],
};

const SidebarMenuItemContent = ({
  item,
  isActive,
}: {
  item: SidebarMenuItemType;
  isActive: boolean;
}) => (
  <>
    {item.icon && (
      <item.icon
        className={cn(
          "h-5 w-5 transition-transform duration-300",
          isActive ? "text-blue-500 scale-110" : "text-gray-500 group-hover:text-gray-700"
        )}
      />
    )}
    <span
      className={cn(
        "font-medium transition-all duration-300",
        isActive ? "text-blue-600" : "text-gray-600 group-hover:text-gray-800"
      )}
    >
      {item.title}
    </span>
  </>
);

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const menus = menuByRole[userRole];

  return (
    <Sidebar {...props} className="bg-white shadow-lg">
      <SidebarHeader className="border-b">
        <h2 className="text-xl font-bold text-gray-800 px-4 py-3 capitalize">
          {userRole} Panel
        </h2>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {menus?.map((item) =>
          item.children ? (
            <Collapsible key={item.title} defaultOpen className="mb-2">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 group">
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="h-5 w-5 text-gray-500" />}
                      <span className="font-semibold text-gray-700">{item.title}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="pl-4 pt-2">
                    <SidebarMenu>
                      {item.children.map((child) => {
                        const isActive = pathname === child.url;
                        return (
                          <SidebarMenuItem key={child.title} className="mb-1">
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className={cn(
                                "w-full justify-start gap-3 rounded-md transition-all duration-300",
                                isActive
                                  ? "bg-blue-100 text-blue-600 shadow-sm"
                                  : "hover:bg-gray-100"
                              )}
                            >
                              <Link href={child.url ?? ""}>
                                <SidebarMenuItemContent item={child} isActive={isActive} />
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : (
            <SidebarGroup key={item.title} className="mb-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={cn(
                      "w-full justify-start gap-3 rounded-md transition-all duration-300",
                      pathname === item.url
                        ? "bg-blue-100 text-blue-600 shadow-sm"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Link href={item.url ?? ""}>
                      <SidebarMenuItemContent item={item} isActive={pathname === item.url} />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
