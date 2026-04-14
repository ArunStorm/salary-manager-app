const admin = require("firebase-admin");
const path = require("path");

try {
  // Try to load from environment variable first (production)
  let serviceAccount;
  
  if (process.env.FIREBASE_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
  } else {
    // Fallback to local file (development)
    serviceAccount = require("./serviceAccountKey.json");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:");
  console.error("   Ensure either:");
  console.error("   1. serviceAccountKey.json exists in server/ directory");
  console.error("   2. FIREBASE_KEY environment variable is set");
  process.exit(1);
}

const db = admin.firestore();
module.exports = db;