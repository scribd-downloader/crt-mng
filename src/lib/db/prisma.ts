import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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

  const isDbConnectionError =
    rawMsg.includes("Can't reach database server") ||
    rawMsg.includes("connect ECONNREFUSED") ||
    rawMsg.includes("ETIMEDOUT") ||
    rawMsg.includes("P1000") ||
    rawMsg.includes("P1001") ||
    rawMsg.includes("P1002") ||
    rawMsg.includes("P1003") ||
    rawMsg.includes("P1017") ||
    rawMsg.includes("P2021") ||
    rawMsg.includes("P2022") ||
    rawMsg.includes("localhost:5432") ||
    /postgres(?:ql)?:\/\//i.test(rawMsg);

  if (isDbConnectionError) {
    return "Database connection error. Please verify your production PostgreSQL configuration and database availability.";
  }

  // Strip sensitive credentials if present in generic error messages
  return rawMsg
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, "[REDACTED_DB_URL]")
    .replace(/api_key=[^\s"']+/gi, "api_key=[REDACTED_API_KEY]");
}

