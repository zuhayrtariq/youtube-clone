import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface SubscribeButtonProps {
  onClick: any;
  disabled?: boolean;
  className?: string;
  isSubscribed: boolean;
  size?: any;
}

const SubscribeButton = ({
  onClick,
  disabled,
  className,
  isSubscribed,
  size,
}: SubscribeButtonProps) => {
  return (
    <Button
      size={size}
      className={cn(className, "rounded-full")}
      onClick={onClick}
      disabled={disabled}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};

export default SubscribeButton;
