"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Baby, Heart, HeartHandshake, Scale, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SubscriptionGuard } from "@/components/subscription/SubscriptionGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllDocuments } from "@/lib/indexeddb/database";
import { useLicenseStore } from "@/lib/store/app-store";
import type { LocalDocument } from "@/types/certificate";

const certTypes = [
  { href: "/certificates/birth", label: "Birth Certificate", icon: Baby },
  { href: "/certificates/death", label: "Death Certificate", icon: Heart },
  { href: "/certificates/marriage", label: "Marriage Certificate", icon: HeartHandshake },
  { href: "/certificates/divorce", label: "Divorce Certificate", icon: Scale },
];

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [docs, setDocs] = useState<LocalDocument[]>([]);
  const status = useLicenseStore((s) => s.status);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.email) setEmail(data.user.email);
      })
      .catch(() => {});

    getAllDocuments().then(setDocs).catch(() => {});
  }, []);

  const expiry = status?.expiresAt
    ? new Date(status.expiresAt).toLocaleDateString("en-GB")
    : "—";

  return (
    <DashboardLayout>
      <SubscriptionGuard>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {email || "User"}</h1>
            <p className="text-muted-foreground text-sm">
              Certificate data stays on this device only.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700">
                  {status?.status ?? "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold capitalize">{status?.plan || "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Expires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{expiry}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Days Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{status?.daysRemaining ?? "—"}</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {certTypes.map((c) => (
                <Button key={c.href} variant="outline" className="h-auto py-4 justify-start gap-3" asChild>
                  <Link href={c.href}>
                    <Plus className="h-4 w-4" />
                    <c.icon className="h-5 w-5 text-primary" />
                    {c.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Documents</h2>
              <Button variant="link" asChild>
                <Link href="/documents">View all</Link>
              </Button>
            </div>
            {docs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No local documents yet. Create a certificate to get started.
              </p>
            ) : (
              <div className="border rounded-lg divide-y">
                {docs.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="p-3 flex justify-between text-sm">
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-muted-foreground capitalize">{doc.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SubscriptionGuard>
    </DashboardLayout>
  );
}
