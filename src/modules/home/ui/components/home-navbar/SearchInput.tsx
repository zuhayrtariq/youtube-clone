import { SearchIcon } from "lucide-react";
import React from "react";

const SearchInput = () => {
  // Todo : Add Search Functionality
  return (
    <form className="flex w-full max-w-[600px]">
      <div className="w-full relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2.5 pr-12 rounded-l-full  border focus:outline-none focus:border-blue-500 "
        />
      </div>
      <button
        type="submit"
        className="bg-gray-100 border-l-0 border px-5 py-2.5 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};

export default SearchInput;
