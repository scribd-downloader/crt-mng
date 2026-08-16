import { PrismaClient, PlanInterval, UserRole } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { generateKeyPairSync, randomBytes } from "crypto";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

function ensureLicenseKeys() {
  const envPath = join(process.cwd(), ".env");
  let envContent = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

  if (
    envContent.includes("LICENSE_PRIVATE_KEY=") &&
    !envContent.match(/LICENSE_PRIVATE_KEY=""?\s*$/m) &&
    envContent.includes("BEGIN PRIVATE KEY")
  ) {
    console.log("License keys already present in .env");
    return;
  }

  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const privEscaped = privateKey.replace(/\n/g, "\\n");
  const pubEscaped = publicKey.replace(/\n/g, "\\n");

  if (!existsSync(envPath)) {
    const example = existsSync(join(process.cwd(), ".env.example"))
      ? readFileSync(join(process.cwd(), ".env.example"), "utf8")
      : "";
    envContent = example;
  }

  if (envContent.includes("LICENSE_PRIVATE_KEY=")) {
    envContent = envContent.replace(
      /LICENSE_PRIVATE_KEY=.*/,
      `LICENSE_PRIVATE_KEY="${privEscaped}"`
    );
  } else {
    envContent += `\nLICENSE_PRIVATE_KEY="${privEscaped}"\n`;
  }

  if (envContent.includes("LICENSE_PUBLIC_KEY=")) {
    envContent = envContent.replace(
      /LICENSE_PUBLIC_KEY=.*/,
      `LICENSE_PUBLIC_KEY="${pubEscaped}"`
    );
  } else {
    envContent += `LICENSE_PUBLIC_KEY="${pubEscaped}"\n`;
  }

  if (!envContent.includes("AUTH_SECRET=") || /AUTH_SECRET="change-this/.test(envContent)) {
    const secret = randomBytes(32).toString("hex");
    if (envContent.includes("AUTH_SECRET=")) {
      envContent = envContent.replace(/AUTH_SECRET=.*/, `AUTH_SECRET="${secret}"`);
    } else {
      envContent += `AUTH_SECRET="${secret}"\n`;
    }
  }

  writeFileSync(envPath, envContent);
  console.log("Generated LICENSE keys and wrote to .env");
}

async function main() {
  ensureLicenseKeys();

  const monthly = await prisma.plan.upsert({
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

  const yearly = await prisma.plan.upsert({
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

  await prisma.appSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      appName: process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager",
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923192012074",
      offlineGraceDays: 7,
      licenseValidityHours: 168,
    },
    update: {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923192012074",
    },
  });

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

  console.log("Seed complete.");
  console.log(`Plans: ${monthly.slug}, ${yearly.slug}`);
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log("Change the admin password after first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
