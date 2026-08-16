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
}

interface Customer {
  id: string;
  email: string;
  name: string | null;
  subscription: {
    status: string;
    plan: string;
    startDate: string | null;
    expiryDate: string | null;
    deviceLimit: number;
  } | null;
  activeDevices: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [email, setEmail] = useState("");
  const [planId, setPlanId] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .catch(() => {});
    fetch("/api/admin/plans")
      .then((r) => r.json())
      .then((d) => {
        setPlans(d.plans ?? []);
        if (d.plans?.[0]) setPlanId(d.plans[0].id);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const activate = async () => {
    const res = await fetch("/api/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, planId, notes }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Subscription activated." : data.error || "Failed");
    if (res.ok) {
      setEmail("");
      setNotes("");
      load();
    }
  };

  const action = async (userId: string, act: string, months?: number) => {
    const res = await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: act, months }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Action ${act} completed.` : data.error || "Failed");
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Activate Subscription</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Plan</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button onClick={activate}>Activate Subscription</Button>
        </CardContent>
      </Card>

      {message && <p className="mb-4 text-sm bg-muted p-2 rounded">{message}</p>}

      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Plan</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Expiry</th>
              <th className="text-left p-3">Devices</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.subscription?.plan ?? "—"}</td>
                <td className="p-3">{c.subscription?.status ?? "PENDING"}</td>
                <td className="p-3">
                  {c.subscription?.expiryDate
                    ? new Date(c.subscription.expiryDate).toLocaleDateString("en-GB")
                    : "—"}
                </td>
                <td className="p-3">{c.activeDevices}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    <Button size="sm" variant="outline" onClick={() => action(c.id, "extend", 1)}>
                      +1mo
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => action(c.id, "extend", 12)}>
                      +1yr
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => action(c.id, "suspend")}>
                      Suspend
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => action(c.id, "reset")}>
                      Reset License
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
