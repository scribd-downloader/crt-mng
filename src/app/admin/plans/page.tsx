"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Plan {
  id: string;
  name: string;
  slug: string;
  interval: string;
  price: number;
  currency: string;
  deviceLimit: number;
  features: string[];
  isActive: boolean;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Plan | null>(null);

  const load = () => {
    fetch("/api/admin/plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        name: editing.name,
        price: editing.price,
        deviceLimit: editing.deviceLimit,
        isActive: editing.isActive,
      }),
    });
    setEditing(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Plans</h1>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>
                  {plan.name} ({plan.interval})
                </span>
                <Button size="sm" variant="outline" onClick={() => setEditing(plan)}>
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                Price: {plan.currency} {plan.price}
              </p>
              <p>Device limit: {plan.deviceLimit}</p>
              <p>Active: {plan.isActive ? "Yes" : "No"}</p>
              <ul className="list-disc list-inside text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {editing && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit {editing.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-w-md">
            <div>
              <Label>Name</Label>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Device Limit</Label>
              <Input
                type="number"
                value={editing.deviceLimit}
                onChange={(e) =>
                  setEditing({ ...editing, deviceLimit: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
