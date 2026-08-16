"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Card>
          <CardHeader>
            <CardTitle>Version 1</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Template customization (office name, logo, colors, numbering) is planned.
            Certificate layouts follow the supplied reference forms and are protected
            from accidental redesign in this version.
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
