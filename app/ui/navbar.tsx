"use client";

import React, { useState, useEffect } from "react";
import Button from "./button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const isSearchAllowed = pathname === "/" || pathname === "/forum";

  // Use a single useEffect to debounce and handle router.push
  useEffect(() => {
    if (!isSearchAllowed) return; // Don't run effect if search is not allowed

    const handler = setTimeout(() => {
      if (query.trim() !== "") {
        router.push(`/forum?search=${query}`);
      } else {
        router.push("/forum");
      }
    }, 300); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler); // Cleanup timeout on query change
    };
  }, [query, router, isSearchAllowed]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // Update query on each keystroke
  };

  const isLoggedInContent = (
    <div className="flex justify-center items-center gap-2">
      <h1 className="text-white">{session?.user?.name}</h1>
      <button
        onClick={() => {
          router.push("/createPost");
        }}
        className="bg-[#ffa31a] text-black p-2 rounded-md font-bold"
      >
        Create Post
      </button>
      <Button />
    </div>
  );

  const isNotLoggedIn = (
    <div>
      <Link href={"/login"} className="text-white">
        sign in
      </Link>
    </div>
  );

  return (
    <nav className="item-jorok w-full h-14 flex justify-between items-center px-3 fixed z-20">
      <Link href={"/"}>
        <h1 className="text-white font-bold">
          <span className="kuning-jorok rounded-sm px-1 text-black">POST</span>
          HUB
        </h1>
      </Link>
      {/* Search Input */}
      {isSearchAllowed && (
        <input
          className="w-[60%] border-[#ffa31a] border-solid bg-[#292929] text-white p-1 rounded-sm border-2"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search for posts..."
        />
      )}
      {session ? isLoggedInContent : isNotLoggedIn}
    </nav>
  );
}

export default Navbar;
