"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";
import { getRenewalMessage } from "@/lib/whatsapp/utils";
import { useLicenseStore } from "@/lib/store/app-store";

export default function SubscriptionPage() {
  const status = useLicenseStore((s) => s.status);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.email) setEmail(d.user.email);
        if (d.subscription) {
          useLicenseStore.getState().setStatus({
            active: d.subscription.active,
            plan: d.subscription.plan,
            expiresAt: d.subscription.expiresAt ?? "",
            daysRemaining: d.subscription.daysRemaining,
            status: d.subscription.status,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-lg space-y-4">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account</span>
              <span>{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold">{status?.status ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="capitalize">{status?.plan || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires</span>
              <span>
                {status?.expiresAt
                  ? new Date(status.expiresAt).toLocaleDateString("en-GB")
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days Remaining</span>
              <span>{status?.daysRemaining ?? "—"}</span>
            </div>
            <WhatsAppButton
              className="w-full mt-4"
              message={getRenewalMessage()}
              label="Renew via WhatsApp"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
