"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicLayout";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";
import { getPurchaseMessage } from "@/lib/whatsapp/utils";

interface Plan {
  id: string;
  name: string;
  slug: string;
  interval: string;
  price: number;
  currency: string;
  features: string[];
  deviceLimit: number;
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch("/api/public/config")
      .then((r) => r.json())
      .then((data) => setPlans(data.plans ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Simple Pricing</h1>
            <p className="text-muted-foreground">
              Contact us on WhatsApp to purchase. Administrator activates your subscription after payment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.interval === "MONTHLY" ? "Billed monthly" : "Billed yearly"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {plan.currency} {plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.interval === "MONTHLY" ? "mo" : "yr"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {plan.deviceLimit} device{plan.deviceLimit > 1 ? "s" : ""}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <WhatsAppButton
                    className="w-full"
                    message={getPurchaseMessage(plan.name)}
                    label={`Purchase ${plan.name}`}
                  />
                </CardFooter>
              </Card>
            ))}

            {plans.length === 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Plan</CardTitle>
                    <CardDescription>Billed monthly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">PKR 2,000/mo</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />All certificate types</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />PDF & JPG export</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />1 device</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <WhatsAppButton className="w-full" message={getPurchaseMessage("Monthly")} />
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Yearly Plan</CardTitle>
                    <CardDescription>Billed yearly — save 20%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold mb-4">PKR 20,000/yr</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />All certificate types</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />PDF & JPG export</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />2 devices</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <WhatsAppButton className="w-full" message={getPurchaseMessage("Yearly")} />
                  </CardFooter>
                </Card>
              </>
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="link" asChild>
              <Link href="/register">Create an account first →</Link>
            </Button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
