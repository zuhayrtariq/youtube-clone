import HomeNavbar from "@/components/HomeNavbar";
import HomeSidebar from "@/components/HomeSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex min-h-screen pt-16">
          {/* Sidebar */}
          <HomeSidebar />
          <main className="flex flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HomeLayout;
