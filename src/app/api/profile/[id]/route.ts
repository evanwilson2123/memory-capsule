import connectToDatabase from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import TimeCapsule, { ITimeCapsule } from "@/models/TimeCapsule";

interface Profile {
  timeCapsules: ITimeCapsule[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = params;

    console.log("Fetching profile with ID:", id);

    // Fetch all time capsules where userId matches the provided id
    const timeCapsules = await TimeCapsule.find({ userId: id }).lean();

    if (!timeCapsules) {
      return NextResponse.json(
        { error: "No time capsules found for this user." },
        { status: 404 }
      );
    }

    // Return the time capsules in the format expected by the front end
    const profile: Profile = {
      timeCapsules: timeCapsules,
    };

    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error("Error occurred while fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}
