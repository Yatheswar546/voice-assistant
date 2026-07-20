const mongoose = require("mongoose");

const uri =
  "mongodb+srv://yatheswar546_db_user:1V9oDoSfNzKBW16R@cluster0.evhznux.mongodb.net/voice-assistant-db?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    await mongoose.connect(uri);

    console.log("✅ Connected Successfully!");

    await mongoose.disconnect();

    console.log("✅ Disconnected Successfully!");
  } catch (err) {
    console.error(err);
  }
}

testConnection();