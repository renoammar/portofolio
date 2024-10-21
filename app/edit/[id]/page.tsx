// app/edit/[id]/page.jsx
"use server";

import { db } from "@/app/db/db";
import { auth } from "@/app/auth";
import { updatePostAction } from "@/app/action/action";

interface editProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: editProps) {
  const postId = parseInt(params.id);

  const session = await auth();
  const currentUserId = session?.user?.id;

  const post = await db.post.findUnique({ where: { id: postId } });

  if (!post) {
    return <p>Post not found.</p>;
  }

  // Check if the current user is the author
  if (currentUserId !== post.userId.toString()) {
    return <p>You are not authorized to edit this post.</p>;
  }

  return (
    <form
      action={updatePostAction}
      className="bg-[#1b1b1b] text-white w-full h-screen flex justify-center items-center flex-col p-4"
    >
      <div className="bg-[#292929] w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-[#ffa31a]">Edit Post</h1>
        <input type="hidden" name="postId" value={postId} />
        <input type="hidden" name="userId" value={currentUserId} />
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-[#808080]"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            name="newTitle"
            id="title"
            defaultValue={post.title}
            required
            className="mt-1 p-2 block w-full bg-[#292929] border border-[#808080] rounded-lg shadow-sm focus:outline-none focus:ring-[#ffa31a] focus:border-[#ffa31a]"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-[#808080]"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            name="newContent"
            id="content"
            defaultValue={post.content}
            required
            className="mt-1 p-2 block w-full bg-[#292929] border border-[#808080] rounded-lg shadow-sm focus:outline-none focus:ring-[#ffa31a] focus:border-[#ffa31a]"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-[#ffa31a] text-[#1b1b1b] font-semibold py-2 px-4 rounded-lg hover:bg-[#ffb34a] transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </form>
  );
}
