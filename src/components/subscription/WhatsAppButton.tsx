"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/whatsapp/utils";
import { cn } from "@/components/ui/utils";

interface WhatsAppButtonProps {
  message?: string;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  label?: string;
}

export function WhatsAppButton({
  message = "Hello, I want to purchase a subscription for Certificate Manager.",
  variant = "default",
  className,
  label = "Contact on WhatsApp",
}: WhatsAppButtonProps) {
  const url = getWhatsAppUrl(message);

  return (
    <Button variant={variant} className={cn("gap-2", className)} asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}
