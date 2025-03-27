import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/user-avatar";
import { commentInsertSchema, commentUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success("Comment added");
      utils.comments.getMany.invalidate({ videoId });
      //   onSuccess?.();
    },
    onError: (e) => {
      if (e.data?.code == "UNAUTHORIZED") clerk.openSignIn();
      else toast.message(e.message);
    },
  });
  type commentInsertType = Omit<z.infer<typeof commentInsertSchema>, "userId">;
  const form = useForm<commentInsertType>({
    resolver: zodResolver(
      commentInsertSchema.omit({
        userId: true,
      })
    ),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  const handleSubmit = (values: commentInsertType) => {
    console.log("CALLED");
    console.log(values);
    create.mutate(values);
  };
  return (
    <Form {...form}>
      <form
        className="flex gap-4 group"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size={"lg"}
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.fullName || "User"}
        />
        <div className="w-full max-w-[calc(100%-80px)]">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comment"
                    className="resize-none bg-transparent overflow-hidden"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 mt-2 ">
            <Button
              type="submit"
              size={"sm"}
              disabled={create.isPending}
              // onClick={() => create.mutate({ videoId, value: "Testing" })}
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
