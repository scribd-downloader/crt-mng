"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalCustomers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  monthlySubscribers: number;
  yearlySubscribers: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats))
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Total Customers", value: stats?.totalCustomers },
    { label: "Active Subscriptions", value: stats?.activeSubscriptions },
    { label: "Expired Subscriptions", value: stats?.expiredSubscriptions },
    { label: "Monthly Subscribers", value: stats?.monthlySubscribers },
    { label: "Yearly Subscribers", value: stats?.yearlySubscribers },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{c.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Admin cannot view customer certificate contents. Only account and subscription metadata is available.
      </p>
    </AdminLayout>
  );
}
