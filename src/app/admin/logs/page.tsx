"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/DashboardLayout";

interface Log {
  id: string;
  action: string;
  details: string | null;
  adminEmail: string;
  targetEmail: string | null;
  createdAt: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setLogs(d.logs ?? []))
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Logs</h1>
      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Admin</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Target</th>
              <th className="text-left p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-3">{log.adminEmail}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.targetEmail ?? "—"}</td>
                <td className="p-3 max-w-xs truncate">{log.details ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
