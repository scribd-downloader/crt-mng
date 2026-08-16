"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import { formatCNIC } from "@/lib/utils";

interface CNICFieldInputProps {
  value: string;
  onChange: (value: string) => void;
  active?: boolean;
  className?: string;
  onFocus?: () => void;
  disabled?: boolean;
}

export function CNICFieldInput({
  value,
  onChange,
  active = false,
  className,
  onFocus,
  disabled,
}: CNICFieldInputProps) {
  return (
    <Input
      dir="ltr"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(formatCNIC(e.target.value))}
      onFocus={onFocus}
      disabled={disabled}
      maxLength={15}
      placeholder="XXXXX-XXXXXXX-X"
      className={cn(
        "font-mono tracking-wide text-base font-bold text-slate-900",
        active && "ring-2 ring-primary border-primary",
        className
      )}
    />
  );
}
