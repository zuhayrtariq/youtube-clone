import HomeLayout from "@/modules/home/ui/layouts/home-layout";
import React from "react";
export const dynamic = "force-dynamic";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="">
      <HomeLayout>{children}</HomeLayout>
    </div>
  );
};

export default Layout;
