import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import SubscriptionView from "../../components/SubscriptionView";
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
