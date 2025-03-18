import React from "react";
import CategoriesSection from "../sections/categories-section";

interface HomeViewProps {
  categoryId?: string | number;
}

const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] mb-10 px-4 pt-2.5 flex grow flex-col gap-y-6 mx-auto   w-full">
      <CategoriesSection categoryId={categoryId} />
    </div>
  );
};

export default HomeView;
