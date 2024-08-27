import connectToDatabase from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password, email } = body;

  try {
    await connectToDatabase();

    const user = await User.create({
      username,
      password,
      email,
    });

    await user.save();

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "User creation failed",
      },
      { status: 500 }
    );
  }
}
