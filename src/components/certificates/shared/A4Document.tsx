"use client";

import { cn } from "@/components/ui/utils";

interface A4DocumentProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function A4Document({ children, id, className }: A4DocumentProps) {
  return (
    <div
      id={id}
      className={cn(
        "certificate-document bg-white text-certificate-red",
        "w-[210mm] min-h-[297mm] mx-auto box-border flex flex-col justify-between shrink-0",
        "border-[4px] border-double border-certificate-red",
        "p-[4mm]",
        "text-[10px] leading-tight",
        "print:w-[210mm] print:min-h-[297mm] print:m-0 print:border-[4px]",
        className
      )}
      style={{ fontFamily: "'Segoe UI', Roboto, 'Noto Sans Arabic', Tahoma, sans-serif" }}
    >
      {children}
    </div>
  );
}
