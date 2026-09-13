const { execSync } = require("child_process");

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
  try {
    console.log("Pushing Prisma schema to database (10s timeout)...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", timeout: 10000 });
  } catch (err) {
    console.warn("Notice: Prisma DB push skipped or timed out during build:", err?.message || err);
  }
} else {
  console.log("Local or missing DATABASE_URL detected, skipping automatic DB push during build.");
}
