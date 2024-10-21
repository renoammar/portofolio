import { auth } from "@/app/auth";
import { db } from "@/app/db/db";
import Link from "next/link";
import ReplyForm from "../ReplyPages";

type ViewProps = {
  params: {
    id: string;
  };
};

async function PostViewPage({ params }: ViewProps) {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <h1 className="text-center text-white">
        Sorry, this page is unavailable. You need to sign in.
      </h1>
    );
  }

  const postId = parseInt(params.id, 10);

  // Fetch the post with its associated user and replies
  const selectedPostById = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!selectedPostById) {
    return (
      <p className="text-center text-white">This page is not available.</p>
    );
  }
  const replies = selectedPostById.replies;
  return (
    <div className="bg-[#1b1b1b] h-screen pt-[5%]  w-full flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl px-4 flex justify-center items-center flex-col gap-4 ">
        {/* Header section */}
        <div className="w-full px-4 py-3 flex justify-between items-center border-b-2 border-[#ffa31a] bg-[#292929] rounded-lg">
          <Link
            href="/forum"
            className="bg-[#ffa31a] text-black font-semibold px-3 py-1 text-sm rounded hover:bg-[#ffb84a] transition"
          >
            Back to Forum
          </Link>
          <h2 className="text-xl font-bold text-white text-center flex-1 px-2">
            {selectedPostById.title}
          </h2>
        </div>

        {/* Post Content Section */}
        <div className="bg-[#292929] rounded-lg p-4 shadow-lg w-full">
          <p className="text-gray-300 text-base leading-relaxed">
            {selectedPostById.content}
          </p>
          <h3 className="mt-4 text-xs text-gray-400">
            Posted By:{" "}
            <span className="text-white">
              {selectedPostById.user?.username || "Unknown User"}
            </span>
          </h3>
        </div>

        {/* Replies Section */}
        <div className="w-full mt-4">
          <h3 className="text-lg font-bold text-white mb-2">Replies</h3>
          {/* Scrollable Container */}
          <div className="max-h-48 overflow-y-auto pr-2 bg-[#292929] rounded-lg p-4 shadow-lg">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-[#1f1f1f] rounded-lg p-3 mb-3"
                >
                  <p className="text-gray-300 text-sm">{reply.content}</p>
                  <div className="mt-1 text-xs text-gray-400">
                    <span className="text-white">{reply.user.username}</span> -{" "}
                    {new Date(reply.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#ffa31a]">No There is no reply yet</p>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <ReplyForm postId={postId} />
      </div>
    </div>
  );
}

export default PostViewPage;
