import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import TrendingView from "../../components/TrendingView";
export const dynamic = "force-dynamic";

const TrendingPage = async () => {
  void trpc.videos.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default TrendingPage;
