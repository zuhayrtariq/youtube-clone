import { DEFAULT_LIMIT } from "@/constants";
import SubscriptionView from "@/modules/home/ui/views/subscription-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
export const dynamic = "force-dynamic";

const SubscriptionsPage = async () => {
  void trpc.videos.getManySubscriptions.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <SubscriptionView />
    </HydrateClient>
  );
};

export default SubscriptionsPage;
