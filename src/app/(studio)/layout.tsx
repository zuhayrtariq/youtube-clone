import React, { ReactNode } from "react";
import StudioLayout from "./components/StudioLayout";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
