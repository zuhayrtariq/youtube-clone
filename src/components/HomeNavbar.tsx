import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchInput from "./SearchInput";
import AuthButton from "./AuthButton";

const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 bg-white flex items-center px-2 h-16 pr-5 right-0">
      <div className="flex items-center gap-4 shrink-0 ">
        {/* Menu & Logo */}

        <SidebarTrigger />
        <Link prefetch href={"/"}>
          <div className="flex items-center gap-1">
            <Image src={"/logo.svg"} width={32} height={32} alt="Logo" />
            <p className="text-xl tracking-tight font-semibold hidden md:flex">
              ZeeTube
            </p>
          </div>
        </Link>
      </div>

      {/* SearchBar */}
      <div className="flex flex-1 justify-center max-w-[700px] w-full mx-auto px-4">
        <SearchInput />
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <AuthButton />
      </div>
    </nav>
  );
};

export default HomeNavbar;
