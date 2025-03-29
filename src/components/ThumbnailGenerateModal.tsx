"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ResponsiveModal from "./ResponsiveModal";

interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

const ThumbnailGenerateModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailGenerateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const utils = trpc.useUtils();
  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      // utils.studio.getMany.invalidate();
      // utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Generating new thumbnail", {
        description: "This may take some time",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (e) => {
      toast.error("Unable to generate thumbnail :" + e.message);
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({
      id: videoId,
      prompt: values.prompt,
    });
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ videoId });
    onOpenChange(false);
  };
  return (
    <ResponsiveModal
      title="Generate Thumbnail"
      open={open}
      onOpenChange={() => {
        form.clearErrors();
        onOpenChange(false);
      }}
    >
      <div className="flex items-center  w-full ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none w-full"
                      //   cols={30}
                      rows={5}
                      placeholder="A description of the thumbnail"
                    />
                  </FormControl>
                  {form.formState.errors.prompt &&
                    form.formState.isSubmitted && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.prompt.message}
                      </p>
                    )}
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={generateThumbnail.isPending}>
                Generate
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ResponsiveModal>
  );
};

export default ThumbnailGenerateModal;
