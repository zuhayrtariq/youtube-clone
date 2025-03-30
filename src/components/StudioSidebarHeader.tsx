import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";

const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    if (state === "collapsed") {
      return (
        <div className="flex items-center justify-center">
          <Skeleton className="size-[30px] rounded-full" />
        </div>
      );
    }
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <Skeleton className="flex flex-col mt-2 items-center" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </SidebarHeader>
    );
  }
  const fullName = user?.fullName || "User";
  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={"Your profile"} asChild>
          <Link prefetch className="" href={"/user/current"}>
            <UserAvatar imageUrl={user?.imageUrl} size={"xs"} name={fullName} />
            <span className="text-sm">Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href={"/users/current"}>
        <UserAvatar
          imageUrl={user?.imageUrl}
          name={fullName}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col mt-2 items-center">
        <p className="text-sm font-medium">User Profile</p>
        <p className="text-xs text-muted-foreground">{fullName}</p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
