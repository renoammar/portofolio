"use client";
import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "";
  const currentSearch = searchParams.get("search") || "";

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    return params.toString();
  };

  const handleSort = (sort: string) => {
    const queryString = createQueryString("sort", sort);
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="h-screen w-64 bg-[#1b1b1b] text-gray-400 flex flex-col border-r-2 border-[#292929]">
      <div className="p-4 text-center font-bold text-xl text-white">
        POST HUB
      </div>
      <div className="flex-grow p-4">
        <ul className="space-y-4">
          <li
            onClick={() => router.push("/")}
            className={`p-2 rounded-md cursor-pointer ${
              !currentSort ? "bg-[#292929]" : "hover:bg-[#292929]"
            }`}
          >
            Home
          </li>
          <li
            onClick={() => handleSort("latest")}
            className={`p-2 rounded-md cursor-pointer ${
              currentSort === "latest" ? "bg-[#292929]" : "hover:bg-[#292929]"
            }`}
          >
            Latest
          </li>
          <li
            onClick={() => handleSort("oldest")}
            className={`p-2 rounded-md cursor-pointer ${
              currentSort === "oldest" ? "bg-[#292929]" : "hover:bg-[#292929]"
            }`}
          >
            Oldest
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
