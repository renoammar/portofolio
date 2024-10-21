import { db } from "@/app/db/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 10);

    await db.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Password reset failed" },
      { status: 500 }
    );
  }
}
