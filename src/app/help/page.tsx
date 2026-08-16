import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Help</h1>

        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Certificate and applicant data (names, CNIC, addresses, etc.) is stored
              only on your device using IndexedDB. It is never sent to the server.
            </p>
            <p>
              The cloud only stores your account email, subscription, and license metadata.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Ensure your subscription is active.</li>
              <li>Open a certificate type from the sidebar.</li>
              <li>Fill English (left) and Urdu (right) fields.</li>
              <li>Use the Urdu Keyboard toggle for on-screen typing.</li>
              <li>Preview updates live on the A4 document.</li>
              <li>Save locally, then export PDF/JPG or print.</li>
            </ol>
          </CardContent>
        </Card>

        <WhatsAppButton label="Contact Support on WhatsApp" />
      </div>
    </DashboardLayout>
  );
}
