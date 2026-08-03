import { spawnSync } from "node:child_process";

// Next.js 15.5+ can race on worker threads during "Collecting page data" (/_document ENOENT).
process.env.NEXT_PRIVATE_WORKER_THREADS = "false";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
