"use server";

import Link from "next/link";
import { db } from "../db/db";
import { auth } from "../auth";
import { deletePostAction } from "@/app/action/action";
import { revalidatePath } from "next/cache";

interface PostProps {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  userId: number;
}

const Post = async ({ id, title, content, createdAt, userId }: PostProps) => {
  const postedBy = await db.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });

  const session = await auth();
  const currentUserId = session?.user?.id;

  const isAuthor = currentUserId && parseInt(currentUserId) === userId;

  const truncatedContent =
    content.length > 50 ? content.substring(0, 50) + "..." : content;

  const handleDelete = async () => {
    "use server";
    try {
      await deletePostAction(id);
      revalidatePath("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-center items-start text-[#ffffff] border-b border-[#ffa31a] w-[50%]">
      <Link href={`/forum/${id}`} className="w-full">
        <p>Posted by: {postedBy ? postedBy.username : "Unknown User"}</p>
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{truncatedContent}</p>
        <p>
          Created:{" "}
          {createdAt
            ? new Date(createdAt).toDateString()
            : "Date not available"}
        </p>
      </Link>

      {isAuthor && (
        <div className="flex justify-center items-center gap-1 mt-4">
          <Link href={`/edit/${id}`}>
            <button
              type="button"
              className="kuning-jorok text-black font-bold rounded px-2 py-1"
            >
              Edit
            </button>
          </Link>
          <form action={handleDelete}>
            <button
              type="submit"
              className="kuning-jorok text-black font-bold rounded px-2 py-1"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
