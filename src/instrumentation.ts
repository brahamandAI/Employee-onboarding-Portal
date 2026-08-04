export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.MONGODB_URI?.trim()) {
    const { connectDB } = await import("@/lib/db/connect");
    connectDB().catch(() => undefined);
  }
}
