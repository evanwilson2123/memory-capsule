import connectToDatabase from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import TimeCapsule, { ITimeCapsule } from "@/models/TimeCapsule";
import {} from "@clerk/nextjs";

interface Profile {
  timeCapsulesCreated: ITimeCapsule[];
  timeCapsulesReceived: ITimeCapsule[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; email: string } }
) {
  try {
    await connectToDatabase();

    const { id, email } = params;

    console.log("Fetching profile with ID:", id);

    // Fetch all time capsules where userId matches the provided id
    const timeCapsulesCreated = await TimeCapsule.find({ userId: id }).lean();
    const timeCapsulesReceived = await TimeCapsule.find({
      recipientEmail: email,
    }).lean();
    if (!timeCapsulesCreated && !timeCapsulesReceived) {
      return NextResponse.json(
        { error: "No time capsules found for this user." },
        { status: 404 }
      );
    }

    // Return the time capsules in the format expected by the front end
    const profile: Profile = {
      timeCapsulesCreated: timeCapsulesCreated,
      timeCapsulesReceived: timeCapsulesReceived,
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
