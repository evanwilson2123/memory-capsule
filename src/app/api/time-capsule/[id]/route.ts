import connectToDatabase from "@/lib/db";
import TimeCapsule from "@/models/TimeCapsule";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    console.log("Fetching time capsule with ID:", id);

    const timeCapsule = await TimeCapsule.findById(id);

    if (!timeCapsule) {
      console.log("Time capsule not found");
      return NextResponse.json(
        { error: "Time capsule not found" },
        { status: 404 }
      );
    }

    console.log("Time capsule found:", timeCapsule);

    return NextResponse.json(timeCapsule, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
