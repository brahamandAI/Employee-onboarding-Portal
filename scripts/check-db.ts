/**
 * Verify MongoDB connection using .env.local
 * Run: npm run db:check
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set. Add it to .env.local");
  process.exit(1);
}

async function main() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI!, {
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 15_000,
      family: 4,
    });
    const dbName = mongoose.connection.db?.databaseName;
    await mongoose.connection.db?.admin().ping();
    console.log("✅ Connected successfully");
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${dbName}`);
    console.log("\nNext steps:");
    console.log("  npm run seed   — create staff users");
    console.log("  npm run dev    — start the app");
  } catch (error) {
    console.error("❌ Connection failed\n");
    if (error instanceof Error) {
      console.error(error.message);
    }

    try {
      const response = await fetch("https://api.ipify.org?format=text", {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const ip = (await response.text()).trim();
        console.error(`\n  Your public IP: ${ip}`);
        console.error("  Add this IP in Atlas → Network Access → Add IP Address");
      }
    } catch {
      // ignore
    }

    console.error("\nTroubleshooting:");
    console.error("  1. Run: npm run db:ip");
    console.error("  2. Check MONGODB_URI in .env.local (include database name)");
    console.error("  3. URL-encode special chars in password (@ → %40)");
    console.error("  4. Atlas → Network Access → add your IP (or 0.0.0.0/0 for dev)");
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
}

main();
