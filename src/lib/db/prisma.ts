import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  const msg = error instanceof Error ? error.message : String(error);
  return msg
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/gi, "[REDACTED_DB_URL]")
    .replace(/api_key=[^\s"']+/gi, "api_key=[REDACTED_API_KEY]");
}
