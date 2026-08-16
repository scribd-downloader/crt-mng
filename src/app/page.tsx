import Link from "next/link";
import {
  FileText,
  Languages,
  Printer,
  Download,
  Shield,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicLayout";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";

const features = [
  {
    icon: FileText,
    title: "Four Certificate Types",
    description:
      "Birth, Death, Marriage, and Divorce registration application forms.",
  },
  {
    icon: Languages,
    title: "English + Urdu",
    description:
      "Bilingual forms with aligned English and Urdu fields, plus on-screen Urdu keyboard.",
  },
  {
    icon: Printer,
    title: "Print Ready",
    description: "A4 portrait documents matching official-style form layouts.",
  },
  {
    icon: Download,
    title: "PDF & JPG Export",
    description: "High-resolution exports preserving Urdu text and form structure.",
  },
  {
    icon: Shield,
    title: "Local Data Privacy",
    description:
      "Certificate data stays on your device. Only account and subscription info is stored in the cloud.",
  },
  {
    icon: Smartphone,
    title: "PWA & Offline",
    description:
      "Install as an app and work offline within your license grace period.",
  },
];

const faqs = [
  {
    q: "Is this an official government certificate?",
    a: "No. This is document preparation and application management software for authorized offices. It does not issue official government certificates unless configured by an authorized organization.",
  },
  {
    q: "Where is my certificate data stored?",
    a: "All certificate and applicant data is stored locally on your device using IndexedDB. It is never sent to our servers.",
  },
  {
    q: "How do I purchase a subscription?",
    a: "Contact us on WhatsApp, pay manually, and provide your account email. An administrator will activate your subscription.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <section className="py-20 px-4 bg-gradient-to-b from-red-50/50 to-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Certificate & Application Management Software
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Prepare, manage, print and export bilingual certificate applications
            quickly and professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <WhatsAppButton variant="outline" />
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 border rounded-lg">
                <f.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Join {appName} and streamline your certificate application workflow.
        </p>
        <Button size="lg" asChild>
          <Link href="/pricing">View Pricing</Link>
        </Button>
      </section>

      <PublicFooter />
    </div>
  );
}
