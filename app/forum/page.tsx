import { db } from "../db/db";
import Post from "../ui/Post";

interface ForumPageProps {
  searchParams: {
    search?: string;
    sort?: "latest" | "oldest";
  };
}

export const revalidate = 0;

async function ForumPage({ searchParams }: ForumPageProps) {
  const searchQuery = searchParams?.search || "";
  const sort = searchParams?.sort || "latest";

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: sort === "oldest" ? "asc" : "desc",
    },
    include: {
      user: true,
    },
    where: searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery } },
            { content: { contains: searchQuery } },
          ],
        }
      : undefined,
  });

  return (
    <div className="h-[100%] pt-[5%] w-screen bg-[#1b1b1b] text-white flex flex-col items-center justify-center gap-2">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            createdAt={post.createdAt}
            userId={post.userId}
          />
        ))
      ) : (
        <div className="h-full">
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {searchQuery
              ? `No posts found matching "${searchQuery}".`
              : "No posts available."}
          </p>
        </div>
      )}
    </div>
  );
}

export default ForumPage;
