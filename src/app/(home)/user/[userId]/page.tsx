import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import UserView from "../components/UserView";
import { DEFAULT_LIMIT } from "@/constants";

interface UserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserPage = async ({ params }: UserPageProps) => {
  const { userId } = await params;
  void trpc.users.getOne.prefetch({
    id: userId,
  });

  void trpc.videos.getMany.prefetchInfinite({
    userId,
    limit: DEFAULT_LIMIT,
  });
  return (
    // <div>User Page</div>
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default UserPage;
