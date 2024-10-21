"use server";
import { redirect } from "next/navigation";
import { compare, hash } from "bcrypt";
import { auth } from "../auth";
import { db } from "../db/db";
import { User } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect";
import { signOut } from "../auth";
import { revalidatePath } from "next/cache";
export async function registerAction(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Check if the email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(
        "This email is already registered. Please use a different email."
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username: username || "", // Provide a fallback if username is undefined
        email: email,
        passwordHash: hashedPassword,
      },
    });
    if (newUser) {
      redirect("/");
    }
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    } else {
      console.error("Error creating user:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Number of salt rounds, typical value is 10
  const hashedPassword = await hash(password, saltRounds);
  return hashedPassword;
}
export async function getUserFromDb(email: string): Promise<User | null> {
  // Find the user by email
  const user = await db.user.findUnique({
    where: { email },
  });

  return user || null;
}
export async function HandleSignout() {
  "use server";
  await signOut();

  revalidatePath("/");
  window.location.reload();
}

export const createPost = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const session = await auth();
  const userId = session?.user?.id;

  console.log("Session:", session); // For debugging
  console.log("User ID from session:", userId); // For debugging

  if (!title || !content) {
    throw new Error("Title and content must not be empty");
  }

  if (!userId) {
    throw new Error("User must be logged in to create a post");
  }

  try {
    const newPost = await db.post.create({
      data: {
        title,
        content,
        userId: parseInt(userId),
      },
    });
    console.log("New post created:", newPost); // For debugging
    if (newPost) {
      redirect("/");
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!email || !newPassword) {
    return { success: false, message: "Email and new password are required" };
  }

  try {
    // Check if the email exists in the database
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email. This email is not registered.",
      };
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
      },
    });

    if (updatedUser) {
      console.log(`Password for user with email ${email} has been updated`);

      // Instead of calling signOut() here, we'll return a flag to indicate that signout is needed
      return {
        success: true,
        message:
          "Password updated successfully. Please log in with your new password.",
        shouldSignOut: true,
      };
    }
  } catch (error: any) {
    console.error("Error updating password:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deletePostAction(postId: number) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("You must be signed in to delete a post.");
  }

  const currentUserId = session.user.id as string;

  try {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      throw new Error("Post not found.");
    }

    // Check if the current user is the author of the post
    if (post.userId !== parseInt(currentUserId)) {
      throw new Error("You are not authorized to delete this post.");
    }

    // Delete all replies associated with the post
    await db.reply.deleteMany({
      where: { postId: postId },
    });

    // Delete the post
    await db.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
  } catch (error: any) {
    console.error("Error deleting post:", error.message);
    throw new Error("Failed to delete post.");
  }
}
export async function updatePostAction(formData: FormData) {
  try {
    // Retrieve values from formData
    const postIdStr = formData.get("postId");
    const newTitle = formData.get("newTitle");
    const newContent = formData.get("newContent");
    const userIdStr = formData.get("userId");

    // Type checks and null checks
    if (
      typeof postIdStr !== "string" ||
      typeof userIdStr !== "string" ||
      typeof newTitle !== "string" ||
      typeof newContent !== "string"
    ) {
      throw new Error("Form data is missing or invalid.");
    }

    // Parse IDs to integers
    const postId = parseInt(postIdStr, 10);
    const userId = parseInt(userIdStr, 10);

    // Find the post by ID
    const post = await db.post.findUnique({ where: { id: postId } });

    // Check if the post exists
    if (!post) {
      throw new Error(`Post with ID ${postId} not found.`);
    }

    // Check if the user is the author of the post
    if (post.userId !== userId) {
      throw new Error("You are not authorized to edit this post.");
    }

    // Update the post
    const updatedPost = await db.post.update({
      where: { id: postId },
      data: {
        title: newTitle,
        content: newContent,
      },
    });

    console.log("Post updated successfully:", updatedPost);
    redirect("/"); // Redirect after update
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    } else {
      console.error("Error updating password:", error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
export async function createReply(postId: number, content: string) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("You must be signed in to reply");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    await db.reply.create({
      data: {
        content,
        postId,
        userId: user.id,
      },
    });

    revalidatePath(`/forum/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create reply:", error);
    return { success: false, error: "Failed to create reply" };
  }
}
