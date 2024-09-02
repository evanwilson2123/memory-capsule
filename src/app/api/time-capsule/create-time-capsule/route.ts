import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse, NextRequest } from "next/server";
import TimeCapsule from "@/models/TimeCapsule";
import connectToDatabase from "@/lib/db";
import nodemailer from "nodemailer";
import cron from "node-cron";

const access_key = process.env.ACCESS_KEY || "";
const secret_key = process.env.SECRET_KEY || "";
const bucket_name = process.env.BUCKET_NAME || "";
const region = process.env.REGION || "";

const sendEmail = async (to: string, subject: string, text: string) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text,
    html: `<p>${text.replace(/\n/g, "<br>")}</p>`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
};

const scheduleEmail = (
  unlockDate: Date,
  recipientEmail: string,
  subject: string,
  text: string
) => {
  const now = new Date();

  const delay = unlockDate.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(async () => {
      await sendEmail(recipientEmail, subject, text);
    }, delay);
  }
};

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});

async function uploadFile(file: Buffer, filename: string, fileType: string) {
  let contentType = "";
  let folder = "";

  switch (fileType) {
    case "image":
      contentType = "image/jpeg";
      folder = "images";
      break;
    case "video":
      contentType = "video/mp4";
      folder = "videos";
      break;
    case "audio":
      if (filename.endsWith(".m4a")) {
        contentType = "audio/mp4";
      } else {
        contentType = "audio/mpeg";
      }
      folder = "audios";
      break;
    default:
      throw new Error("Unsupported file type");
  }

  const key = `${folder}/${filename}-${Date.now()}`;

  const params = {
    Bucket: bucket_name,
    Key: key,
    Body: file,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return key;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();

    // Extract multiple files for each type
    const userId = formData.get("userId")?.toString();
    const files = formData.getAll("image");
    const videos = formData.getAll("video");
    const audios = formData.getAll("audio");
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const message = formData.get("message")?.toString();
    const recipientEmail = formData.get("recipientEmail")?.toString();
    const recipientName = formData.get("recipientName")?.toString();
    const recipientPhone = formData.get("recipientPhone")?.toString();
    const senderName = formData.get("senderName")?.toString();
    const unlockDateString = formData.get("unlockDate")?.toString();
    const unlockDate = unlockDateString
      ? new Date(unlockDateString)
      : undefined;

    const imageFiles: string[] = [];
    const videoFiles: string[] = [];
    const audioFiles: string[] = [];

    // Upload each image file
    for (const file of files) {
      if (typeof file !== "string") {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = await uploadFile(fileBuffer, file.name, "image");
        imageFiles.push(fileName);
      }
    }

    // Upload each video file
    for (const video of videos) {
      if (typeof video !== "string") {
        const videoBuffer = Buffer.from(await video.arrayBuffer());
        const fileName = await uploadFile(videoBuffer, video.name, "video");
        videoFiles.push(fileName);
      }
    }

    // Upload each audio file
    for (const audio of audios) {
      if (typeof audio !== "string") {
        const audioBuffer = Buffer.from(await audio.arrayBuffer());
        const fileName = await uploadFile(audioBuffer, audio.name, "audio");
        audioFiles.push(fileName);
      }
    }

    const timeCapsule = new TimeCapsule({
      userId,
      title,
      description,
      images: imageFiles,
      videos: videoFiles,
      audios: audioFiles,
      message,
      recipientEmail,
      recipientName,
      recipientPhone,
      senderName,
      unlockDate,
    });

    const savedCapsule = await timeCapsule.save();

    // Send email to recipient
    const subject = `You have received a time capsule from ${senderName}`;

    const text = `You have received a time capsule from ${senderName}. You can unlock it on ${unlockDate}. Here is the link:\n https://memory-capsule-livid.vercel.app/view-capsule/${savedCapsule._id}`;

    await sendEmail(recipientEmail as string, subject, text);

    // Schedule email to be sent to recipient
    const subjectSchedule = `Time capsule unlocked from ${senderName}`;

    const textSchedule = `Your time capsule from ${senderName} has been unlocked. Here is the link:\n https://memory-capsule-livid.vercel.app/view-capsule/${savedCapsule._id}\n\nEnjoy!!`;

    scheduleEmail(
      unlockDate as Date,
      recipientEmail as string,
      subjectSchedule,
      textSchedule
    );
    // Build the response object
    const response = {
      message: "Success",
      status: 201,
      data: {
        _id: savedCapsule._id,
        title,
        description,
        message,
        images: imageFiles,
        videos: videoFiles,
        audios: audioFiles,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error occurred:", error);
    console.log(error.message);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
