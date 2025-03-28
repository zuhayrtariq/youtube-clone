import React from "react";
import PlaylistHistorySection from "../sections/playlist-history-section";

const PlaylistHistoryView = () => {
  return (
    <div className="max-w-md mb-10 px-4 pt-2.5 flex grow flex-col gap-y-6 mx-auto   w-full">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-xs text-muted-foreground">Videos you have watched</p>
      </div>
      <PlaylistHistorySection />
    </div>
  );
};

export default PlaylistHistoryView;
