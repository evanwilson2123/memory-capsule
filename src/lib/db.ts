import mongoose from "mongoose";

const MONGO_URI: any = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from being re-established on every reload.
 */
let globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (globalWithMongoose.mongoose.conn) {
    return globalWithMongoose.mongoose.conn;
  }

  if (!globalWithMongoose.mongoose.promise) {
    const options = {
      bufferCommands: false,
    };

    globalWithMongoose.mongoose.promise = mongoose
      .connect(MONGO_URI, options)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }
  globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
  return globalWithMongoose.mongoose.conn;
}

export default connectToDatabase;
