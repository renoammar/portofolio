"use client";
import React from "react";
import { registerAction } from "../action/action";

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#292929]">
      <form
        action={registerAction}
        className="bg-[#1b1b1b] p-6 rounded-lg shadow-lg w-full max-w-md text-[#ffffff]"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#ffa31a] text-center">
          Register
        </h2>
        <div className="mb-4">
          <label
            className="block text-white font-semibold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:border-[#ffa31a] bg-[#ffffff] text-[#1b1b1b]"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:border-[#ffa31a] bg-[#ffffff] text-[#1b1b1b]"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-white font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:border-[#ffa31a] bg-[#ffffff] text-[#1b1b1b]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffa31a] text-[#ffffff] py-2 px-4 rounded-md hover:bg-[#ffb84a] transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
