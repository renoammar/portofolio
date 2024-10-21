import React from "react";
import { createPost } from "../action/action"; // Adjust this import path

function PostForm() {
  return (
    <form
      action={createPost}
      className="bg-[#1b1b1b] text-white w-full h-screen flex justify-center items-center flex-col p-4"
    >
      <div className="bg-[#292929] w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-[#ffa31a]">Create Post</h1>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-[#808080]"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 p-2 block w-full bg-[#292929] border border-[#808080] rounded-lg shadow-sm focus:outline-none focus:ring-[#ffa31a] focus:border-[#ffa31a]"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-[#808080]"
            htmlFor="content"
          >
            Body
          </label>
          <textarea
            name="content"
            id="content"
            required
            className="mt-1 p-2 block w-full bg-[#292929] border border-[#808080] rounded-lg shadow-sm focus:outline-none focus:ring-[#ffa31a] focus:border-[#ffa31a]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-[#ffa31a] text-[#1b1b1b] font-semibold py-2 px-4 rounded-lg hover:bg-[#ffb34a] transition-colors duration-200"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export default PostForm;
