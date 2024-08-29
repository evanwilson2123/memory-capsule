import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimeCapsule extends Document {
  title: string;
  description: string;
  images: string[];
  videos: string[];
  audios: string[];
  message: string;
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  unlockDate: Date;
  createdAt: Date;
}

const TimeCapsuleSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: false },
  videos: { type: [String], required: false },
  audios: { type: [String], required: false },
  message: { type: String, required: false },
  recipientEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientPhone: { type: String, required: true },
  senderName: { type: String, required: true },
  unlockDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TimeCapsule: Model<ITimeCapsule> =
  mongoose.models.TimeCapsule ||
  mongoose.model<ITimeCapsule>("TimeCapsule", TimeCapsuleSchema);

export default TimeCapsule;
