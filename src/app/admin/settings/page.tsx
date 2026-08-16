"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [offlineGraceDays, setOfflineGraceDays] = useState(7);
  const [licenseValidityHours, setLicenseValidityHours] = useState(168);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setAppName(d.settings.appName ?? "");
          setWhatsappNumber(d.settings.whatsappNumber ?? "");
          setOfflineGraceDays(d.settings.offlineGraceDays ?? 7);
          setLicenseValidityHours(d.settings.licenseValidityHours ?? 168);
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appName,
        whatsappNumber,
        offlineGraceDays,
        licenseValidityHours,
      }),
    });
    setMessage(res.ok ? "Settings saved." : "Failed to save.");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>App Name</Label>
            <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="923001234567"
            />
          </div>
          <div>
            <Label>Offline Grace Days</Label>
            <Input
              type="number"
              value={offlineGraceDays}
              onChange={(e) => setOfflineGraceDays(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>License Validity Hours</Label>
            <Input
              type="number"
              value={licenseValidityHours}
              onChange={(e) => setLicenseValidityHours(Number(e.target.value))}
            />
          </div>
          <Button onClick={save}>Save Settings</Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
