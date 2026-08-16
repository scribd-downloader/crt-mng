import { PlanInterval, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";

let isSeededCache = false;

export async function ensureDatabaseSeeded(): Promise<void> {
  if (isSeededCache) return;

  try {
    // Check if plans and admin exist
    const [planCount, adminCount] = await Promise.all([
      prisma.plan.count(),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
    ]);

    if (planCount > 0 && adminCount > 0) {
      isSeededCache = true;
      return;
    }

    console.log("Auto-seeding initial database state...");

    // Seed default plans if missing
    await prisma.plan.upsert({
      where: { slug: "monthly" },
      create: {
        name: "Monthly Plan",
        slug: "monthly",
        interval: PlanInterval.MONTHLY,
        price: 2000,
        currency: "PKR",
        deviceLimit: 1,
        features: JSON.stringify([
          "All certificate types",
          "Bilingual English + Urdu",
          "PDF & JPG export",
          "Print support",
          "Local data storage",
        ]),
        sortOrder: 1,
      },
      update: {},
    });

    await prisma.plan.upsert({
      where: { slug: "yearly" },
      create: {
        name: "Yearly Plan",
        slug: "yearly",
        interval: PlanInterval.YEARLY,
        price: 20000,
        currency: "PKR",
        deviceLimit: 2,
        features: JSON.stringify([
          "All certificate types",
          "Bilingual English + Urdu",
          "PDF & JPG export",
          "Print support",
          "Local data storage",
          "2 devices",
          "Priority support",
        ]),
        sortOrder: 2,
      },
      update: {},
    });

    // Seed AppSettings if missing
    await prisma.appSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        appName: process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager",
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923192012074",
        offlineGraceDays: 7,
        licenseValidityHours: 168,
      },
      update: {},
    });

    // Seed initial admin user if missing
    if (adminCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@certificatemanager.local";
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
      const passwordHash = await hashPassword(adminPassword);

      await prisma.user.upsert({
        where: { email: adminEmail },
        create: {
          email: adminEmail,
          passwordHash,
          name: "Administrator",
          role: UserRole.ADMIN,
        },
        update: {
          passwordHash,
          role: UserRole.ADMIN,
        },
      });

      console.log(`Auto-seeded initial admin account: ${adminEmail}`);
    }

    isSeededCache = true;
  } catch (error) {
    console.error("Error during auto-seeding database:", error);
  }
}
