const { execSync } = require("child_process");

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
  try {
    console.log("Pushing Prisma schema to database...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
  } catch (err) {
    console.warn("Notice: Prisma DB push was skipped or encountered an error:", err?.message || err);
  }
} else {
  console.log("Local or missing DATABASE_URL detected, skipping automatic DB push during build.");
}
