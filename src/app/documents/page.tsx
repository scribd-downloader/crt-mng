"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SubscriptionGuard } from "@/components/subscription/SubscriptionGuard";
import { Button } from "@/components/ui/button";
import { getAllDocuments, deleteDocument } from "@/lib/indexeddb/database";
import type { LocalDocument } from "@/types/certificate";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<LocalDocument[]>([]);

  const load = () => getAllDocuments().then(setDocs).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this local document?")) return;
    await deleteDocument(id);
    load();
  };

  return (
    <DashboardLayout>
      <SubscriptionGuard>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Local Documents</h1>
          <p className="text-sm text-muted-foreground">
            These documents are stored only on this device (IndexedDB).
          </p>
          {docs.length === 0 ? (
            <p className="text-muted-foreground">No documents saved yet.</p>
          ) : (
            <div className="border rounded-lg divide-y">
              {docs.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} · Updated {new Date(doc.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SubscriptionGuard>
    </DashboardLayout>
  );
}
