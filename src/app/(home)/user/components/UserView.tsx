import React from "react";
import UserSection from "./UserSection";
import UserVideosSection from "./VideosSection";

interface UserViewProps {
  userId: string;
}

const UserView = ({ userId }: UserViewProps) => {
  return (
    <div className="flex flex-col w-full max-w-[1300px] mx-auto mb-10 px-4 pt-2.5 gap-y-6 ">
      <UserSection userId={userId} />
      <UserVideosSection userId={userId} />
    </div>
  );
};

export default UserView;
