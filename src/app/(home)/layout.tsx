import React from "react";
import HomeLayout from "./components/HomeLayout";
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
