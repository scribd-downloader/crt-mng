import { prisma } from "../src/lib/db/prisma";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { activateSubscription, getSubscriptionStatus } from "../src/lib/subscription/service";

async function verify() {
  console.log("Testing connection to Prisma Postgres...");
  const planCount = await prisma.plan.count();
  const userCount = await prisma.user.count();
  const settings = await prisma.appSettings.findUnique({ where: { id: "default" } });

  if (settings) {
    console.log("✅ Connected");
    console.log(`Plans in DB: ${planCount}`);
    console.log(`Users in DB: ${userCount}`);
  } else {
    throw new Error("AppSettings not found in database");
  }

  // Test full flow with a test verification account
  const testEmail = "test_verify_user@example.com";
  const testPassword = "TestPassword123!";

  // Cleanup prior test user if exists
  await prisma.user.deleteMany({ where: { email: testEmail } });

  // 1. Create User
  const passwordHash = await hashPassword(testPassword);
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
      name: "Test Verify User",
    },
  });
  console.log("✅ User signup verified:", user.email);

  // 2. Verify Password
  const valid = await verifyPassword(testPassword, user.passwordHash);
  if (!valid) throw new Error("Password verification failed");
  console.log("✅ Password hash verification successful");

  // 3. Admin user check
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("Admin user not found");

  // 4. Activate Monthly Plan
  const monthlyPlan = await prisma.plan.findUnique({ where: { slug: "monthly" } });
  if (!monthlyPlan) throw new Error("Monthly plan not found");

  await activateSubscription({
    adminId: admin.id,
    user,
    planId: monthlyPlan.id,
    durationMonths: 1,
    notes: "Automated verification test",
  });
  console.log("✅ Admin monthly plan activation verified");

  // 5. Subscription status check
  const status = await getSubscriptionStatus(user.id);
  if (!status.active || status.plan !== "monthly") {
    throw new Error(`Subscription status check failed: active=${status.active}, plan=${status.plan}`);
  }
  console.log("✅ Subscription status check verified: Active,", status.daysRemaining, "days remaining");

  // 6. Cleanup test user
  await prisma.user.deleteMany({ where: { email: testEmail } });
  console.log("✅ Cleanup complete");
}

verify()
  .then(() => {
    console.log("🎉 All verification steps passed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });
