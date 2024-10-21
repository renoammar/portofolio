"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result.error);
      setError(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#292929] w-full h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1b1b1b] h-[60vh] p-6 rounded-lg shadow-lg w-full max-w-md text-[#ffffff]"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#ffa31a] text-center">
          Login
        </h2>
        {error && <p className="text-[#ffa31a] text-center mb-4">{error}</p>}
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
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:border-[#ffa31a] bg-[#ffffff] text-[#1b1b1b]"
          />
        </div>
        <div className="">
          {" "}
          <Link href={"/register"} className="underline  text-[#ffa31a]">
            Don&apos;t have an account yet? Register
          </Link>
          <br />
          <Link href={"/reset"} className="underline  text-[#ffa31a]">
            forgot your password
          </Link>
        </div>

        <button
          type="submit"
          className="w-full mt-5 bg-[#ffa31a] text-[#ffffff] py-2 px-4 rounded-md hover:bg-[#ffb84a] transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}
