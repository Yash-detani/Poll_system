import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/* -------------------------------------------------------------------------- */
/*                         Global mongoose cache (Next.js)                    */
/* -------------------------------------------------------------------------- */

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: Cached | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/* -------------------------------------------------------------------------- */
/*                               DB CONNECT                                   */
/* -------------------------------------------------------------------------- */

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "polls", // your database name
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    throw error;
  }

  return cached!.conn;
}

export default dbConnect;
