"use client";

import { useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportAllData, importAllData } from "@/lib/indexeddb/database";

export default function SettingsPage() {
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Backup exported successfully.");
    } catch {
      setMessage("Export failed.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      setMessage("Backup restored successfully.");
    } catch {
      setMessage("Import failed. Check the backup file.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Data Backup</CardTitle>
            <CardDescription>
              Your certificate data is stored locally on this device. Keep a secure
              backup to prevent data loss.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={handleExport}>Export Backup</Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              Import Backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </CardContent>
        </Card>

        {message && (
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{message}</p>
        )}
      </div>
    </DashboardLayout>
  );
}
