import { MongoClient } from "mongodb";
import mongoose from "mongoose";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      };
    }
  }
}

// Export an empty object to ensure this file is treated as a module
export {};
