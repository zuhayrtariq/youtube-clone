import { LucideLoader2 } from "lucide-react";
import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-100">
      <div className="flex gap-4">
        <LucideLoader2 className="animate-spin" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
