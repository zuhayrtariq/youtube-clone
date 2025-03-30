import { CircleAlertIcon } from "lucide-react";
import React from "react";

const ErrorSkeleton = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-100">
      <div className="flex gap-4">
        <CircleAlertIcon className="animate-pulse" />
        Opps! An error occurred.
      </div>
    </div>
  );
};

export default ErrorSkeleton;
