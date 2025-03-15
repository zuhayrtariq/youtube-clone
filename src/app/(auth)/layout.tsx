import React from "react";
interface LayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
