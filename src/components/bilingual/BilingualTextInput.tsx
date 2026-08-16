"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import type { InputLanguage } from "@/lib/store/app-store";
import { mapEnglishToUrduChar } from "@/lib/keyboard/urdu-phonetic";

interface BilingualTextInputProps {
  language: InputLanguage;
  value: string;
  onChange: (value: string) => void;
  active?: boolean;
  className?: string;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function BilingualTextInput({
  language,
  value,
  onChange,
  active = false,
  className,
  onFocus,
  placeholder,
  disabled,
}: BilingualTextInputProps) {
  const isUrdu = language === "ur";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isUrdu || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) {
      return;
    }

    const mapped = mapEnglishToUrduChar(e.key);
    if (mapped) {
      e.preventDefault();
      const input = e.currentTarget;
      const start = input.selectionStart ?? value.length;
      const end = input.selectionEnd ?? start;
      const newValue = value.slice(0, start) + mapped + value.slice(end);
      onChange(newValue);

      requestAnimationFrame(() => {
        const cursor = start + mapped.length;
        input.setSelectionRange(cursor, cursor);
      });
    }
  };

  return (
    <Input
      dir={isUrdu ? "rtl" : "ltr"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "text-base font-semibold text-slate-900",
        isUrdu && "font-urdu text-right text-lg font-bold",
        active && "ring-2 ring-primary border-primary",
        className
      )}
    />
  );
}
