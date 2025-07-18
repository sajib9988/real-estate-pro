'use client';

import { ReactNode } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useUser } from '@/context/UserContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  const userRole = user?.role || 'buyer';

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />

      <SidebarInset>
      
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb className="hidden sm:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{userRole} Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
   

        <main className="p-4 pt-6 relative min-h-[calc(100vh-4rem)] gradientBg">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
