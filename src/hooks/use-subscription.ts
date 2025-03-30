import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("User subscribed!");
      utils.videos.getManySubscriptions.invalidate();
      utils.users.getOne.invalidate({
        id: userId,
      });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (e) => {
      if (e.data?.code == "UNAUTHORIZED") clerk.openSignIn();
      else toast.error("Unable to subscribe " + e.message);
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("User unsubscribed!");
      utils.users.getOne.invalidate({
        id: userId,
      });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (e) => {
      if (e.data?.code == "UNAUTHORIZED") clerk.openSignIn();
      else toast.error("Unable to unsubscribe " + e.message);
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else subscribe.mutate({ userId });
  };
  return {
    isPending,
    onClick,
  };
};
