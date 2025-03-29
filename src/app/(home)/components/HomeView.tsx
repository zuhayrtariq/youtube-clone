import React from "react";
import CategoriesSection from "./CategoriesSection";
import HomeVideosSection from "./HomeVideosSection";

interface HomeViewProps {
  categoryId?: string;
}

const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] mb-10 px-4 pt-2.5 flex grow flex-col gap-y-6 mx-auto   w-full">
      <CategoriesSection categoryId={categoryId} />
      <HomeVideosSection categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
