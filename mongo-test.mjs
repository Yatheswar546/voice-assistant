import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

try {
  console.log("Connecting...");

  await mongoose.connect(uri);

  console.log("✅ Connected Successfully");

  await mongoose.disconnect();

  console.log("Disconnected");
} catch (err) {
  console.error(err);
}