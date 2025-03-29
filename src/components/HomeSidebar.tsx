import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import React from "react";
import { Separator } from "@/components/ui/separator";
import MainSection from "./SidebarMainSection";
import PersonalSection from "./SidebarPersonalSection";

const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
