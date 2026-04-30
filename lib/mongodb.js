import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not defined. Add it to .env.local (dev) or Vercel Environment Variables (production).",
  );
}

// Use a global cache to survive Next.js hot reloads in dev
// and Vercel's function reuse across invocations in prod
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10, // Limit connections — important for serverless
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next call retries
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
