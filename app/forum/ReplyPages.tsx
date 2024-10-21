"use client";

import { useState } from "react";
import { createReply } from "../action/action";
import { useRouter } from "next/navigation";

type ReplyFormProps = {
  postId: number;
};

export default function ReplyForm({ postId }: ReplyFormProps) {
  const [replyContent, setReplyContent] = useState("");
  const router = useRouter();

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    const result = await createReply(postId, replyContent);
    if (result.success) {
      setReplyContent("");
      router.refresh(); // This will trigger a refresh of the server components
    } else {
      alert("Failed to post reply. Please try again.");
    }
  };

  return (
    <form onSubmit={handleReplySubmit} className="w-full mt-6 z-20">
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        className="w-full p-2 bg-[#292929] text-white rounded-lg"
        placeholder="Write your reply..."
        rows={3}
      />
      <button
        type="submit"
        className="mt-2 bg-[#ffa31a] text-black font-semibold px-4 py-2 rounded hover:bg-[#ffb84a] transition"
      >
        Post Reply
      </button>
    </form>
  );
}
