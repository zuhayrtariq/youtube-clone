import StudioNavbar from "@/components/StudioNavbar";
import StudioSidebar from "@/components/StudioSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

interface StudioLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-16">
          {/* Sidebar */}
          <StudioSidebar />
          <main className="flex flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
