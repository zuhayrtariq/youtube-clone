"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { PlusIcon } from "lucide-react";
import React from "react";

const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
    },
  });
  return (
    <div>
      <Button
        variant={"secondary"}
        className="font-medium"
        onClick={() => create.mutate()}
      >
        <PlusIcon />
        Create
      </Button>
    </div>
  );
};

export default StudioUploadModal;
