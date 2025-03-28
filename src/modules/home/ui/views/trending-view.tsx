import React from "react";
import TrendingVideosSection from "../sections/trending-videos-section";

const TrendingView = () => {
  return (
    <div className="max-w-[2400px] mb-10 px-4 pt-2.5 flex grow flex-col gap-y-6 mx-auto   w-full">
      <div>
        <h1 className="text-2xl font-bold">Trending</h1>
        <p className="text-xs text-muted-foreground">
          Most popular videos at the moment
        </p>
      </div>
      <TrendingVideosSection />
    </div>
  );
};

export default TrendingView;
