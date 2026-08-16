import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";

export function PublicHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary">
          {appName}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">{appName}</h3>
            <p className="text-sm text-muted-foreground">
              Certificate & Application Management Software for authorized offices.
              Document preparation tool — not an official government certificate issuer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Certificates</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Birth Registration</li>
              <li>Death Registration</li>
              <li>Marriage Registration</li>
              <li>Divorce Registration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <WhatsAppButton variant="outline" message="Hello, I have a question about Certificate Manager." />
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
