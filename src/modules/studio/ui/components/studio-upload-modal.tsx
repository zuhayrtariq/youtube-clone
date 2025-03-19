import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";

const StudioUploadModal = () => {
  return (
    <div>
      <Button variant={"secondary"} className="font-medium">
        <PlusIcon />
        Create
      </Button>
    </div>
  );
};

export default StudioUploadModal;
