import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import StudioNavbar from "../ui/components/studio-navbar";
import StudioSidebar from "../ui/components/studio-sidebar";

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
