import React from "react";
import SubscriptionVideosSection from "../sections/subscription-videos-section";

const SubscriptionView = () => {
  return (
    <div className="max-w-[2400px] mb-10 px-4 pt-2.5 flex grow flex-col gap-y-6 mx-auto   w-full">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          Videos from your favorite creators
        </p>
      </div>
      <SubscriptionVideosSection />
    </div>
  );
};

export default SubscriptionView;
