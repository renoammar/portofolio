import React, { ReactNode } from "react";
import { signOut } from "../auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HandleSignout } from "../action/action";

function Button() {
  return (
    <form action={HandleSignout}>
      <button
        className="bg-[#ffa31a] text-black p-2 rounded-md font-bold"
        type="submit"
      >
        sign out
      </button>
    </form>
  );
}

export default Button;
