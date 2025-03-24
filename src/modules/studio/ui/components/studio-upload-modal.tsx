"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { LoaderIcon, PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video Created");
      utils.studio.getMany.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  return (
    <div>
      <Button
        variant={"secondary"}
        className="font-medium"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </div>
  );
};

export default StudioUploadModal;
