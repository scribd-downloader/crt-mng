import { PublicHeader, PublicFooter } from "@/components/layout/PublicLayout";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For subscription purchases, renewals, or support, contact us on WhatsApp Business at{" "}
                <strong className="text-foreground">0319-2012074</strong> (+92 319 2012074).
                Our team will respond during business hours.
              </p>
              <WhatsAppButton className="w-full" />
            </CardContent>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
