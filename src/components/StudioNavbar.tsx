import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import StudioUploadModal from "./StudioUploadModal";
import AuthButton from "./AuthButton";

const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 bg-white flex items-center px-2 h-16 pr-5 right-0 border-b shadow-md">
      <div className="flex items-center gap-4 shrink-0 ">
        {/* Menu & Logo */}

        <SidebarTrigger />
        <Link prefetch href={"/studio"}>
          <div className="flex items-center gap-1">
            <Image src={"/logo.svg"} width={32} height={32} alt="Logo" />
            <p className="text-xl tracking-tight font-semibold">Studio</p>
          </div>
        </Link>
      </div>
      <div className="flex-1"></div>
      <div className="flex shrink-0 items-center gap-4">
        <StudioUploadModal />
        <AuthButton />
      </div>
    </nav>
  );
};

export default StudioNavbar;
