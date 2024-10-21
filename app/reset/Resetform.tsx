"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    const newPassword = formData.get("newPassword") as string;

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        setError("Password reset failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#292929]">
      <form
        action={handleSubmit}
        className="bg-[#1b1b1b] p-6 rounded-lg shadow-lg w-full max-w-md text-[#ffffff]"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#808080] text-center">
          Reset Password
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label
            className="block text-[#808080] font-semibold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:border-[#ffa31a] bg-[#ffffff] text-[#1b1b1b]"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-[#808080] font-semibold mb-2"
            htmlFor="newPassword"
          >
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            required
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:border-[#ffa31a] bg-[#ffffff] text-[#1b1b1b]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffa31a] text-[#ffffff] py-2 px-4 rounded-md hover:bg-[#ffb84a] transition duration-300"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
export default ResetPasswordForm;
