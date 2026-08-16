"use client";

import { PublicHeader, PublicFooter } from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Password Recovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Contact the administrator on WhatsApp to reset your password. Provide
              your registered email address.
            </p>
            <WhatsAppButton
              className="w-full"
              message="Hello, I need to reset my Certificate Manager password."
              label="Contact Admin on WhatsApp"
            />
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}
