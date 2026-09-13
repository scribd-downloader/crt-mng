import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(/^["']|["']$/g, "").trim();
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Always store prisma instance on globalThis to reuse connection pools in serverless functions
globalForPrisma.prisma = prisma;

export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  
  const rawMsg = error instanceof Error ? error.message : String(error);
  
  // Log full error details for server logs silently
  console.error("[Database Error Trace]:", rawMsg);

  const isTableMissingError =
    rawMsg.includes("P2021") ||
    rawMsg.includes("does not exist");

  if (isTableMissingError) {
    return "Database tables have not been created yet in your PostgreSQL database. Please run 'npx prisma db push' or check Vercel/Netlify environment setup.";
  }

  const isEngineError =
    rawMsg.includes("Query engine") ||
    rawMsg.includes("PrismaClientInitializationError") ||
    rawMsg.includes("libquery_engine") ||
    rawMsg.includes("cannot find module");

  if (isEngineError) {
    return "Prisma Query Engine binary missing on serverless host. Please verify '.npmrc' and netlify.toml included files.";
  }

  const isDbConnectionError =
    rawMsg.includes("Can't reach database server") ||
    rawMsg.includes("connect ECONNREFUSED") ||
    rawMsg.includes("ETIMEDOUT") ||
    rawMsg.includes("P1000") ||
    rawMsg.includes("P1001") ||
    rawMsg.includes("P1002") ||
    rawMsg.includes("P1003") ||
    rawMsg.includes("P1017") ||
    rawMsg.includes("P2022") ||
    rawMsg.includes("localhost:5432") ||
    /postgres(?:ql)?:\/\//i.test(rawMsg);

  if (isDbConnectionError) {
    return "Database connection error. Please verify your production PostgreSQL configuration, SSL mode (?sslmode=require), and database availability.";
  }

  // Strip sensitive credentials if present in generic error messages
  return rawMsg
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, "[REDACTED_DB_URL]")
    .replace(/api_key=[^\s"']+/gi, "api_key=[REDACTED_API_KEY]");
}

