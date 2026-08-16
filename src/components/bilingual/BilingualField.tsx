"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/components/ui/utils";
import { useAppStore, type InputLanguage } from "@/lib/store/app-store";
import type { BilingualValue } from "@/types/certificate";
import { BilingualTextInput } from "./BilingualTextInput";
import { CNICFieldInput } from "./CNICFieldInput";

interface BilingualFieldProps {
  labelEn: string;
  labelUr: string;
  value: BilingualValue;
  onChange: (value: BilingualValue) => void;
  activeLanguage: InputLanguage;
  type?: "text" | "cnic" | "phone";
  className?: string;
}

export function BilingualField({
  labelEn,
  labelUr,
  value,
  onChange,
  activeLanguage,
  type = "text",
  className,
}: BilingualFieldProps) {
  const setInputLanguage = useAppStore((s) => s.setInputLanguage);
  const setShowUrduKeyboard = useAppStore((s) => s.setShowUrduKeyboard);

  const handleEnFocus = () => {
    setInputLanguage("en");
    setShowUrduKeyboard(false);
  };

  const handleUrFocus = () => {
    setInputLanguage("ur");
    setShowUrduKeyboard(true);
  };

  const isSyncType = type === "cnic" || type === "phone";

  const handleEnChange = (en: string) => {
    if (isSyncType) {
      onChange({ en, ur: en });
    } else {
      onChange({ ...value, en });
    }
  };

  const handleUrChange = (ur: string) => {
    if (isSyncType) {
      onChange({ en: ur, ur });
    } else {
      onChange({ ...value, ur });
    }
  };

  const enValue = value?.en || (isSyncType ? value?.ur || "" : "");
  const urValue = value?.ur || (isSyncType ? value?.en || "" : "");

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-3 items-start">
        <div className="flex-1 min-w-0 space-y-1">
          <Label htmlFor={`${labelEn}-en`}>{labelEn}</Label>
          {type === "cnic" ? (
            <CNICFieldInput
              value={enValue}
              onChange={handleEnChange}
              active={activeLanguage === "en"}
              onFocus={handleEnFocus}
            />
          ) : (
            <BilingualTextInput
              language="en"
              value={value.en}
              onChange={handleEnChange}
              active={activeLanguage === "en"}
              onFocus={handleEnFocus}
            />
          )}
        </div>

        <div className="w-px bg-border self-stretch mt-7 shrink-0" aria-hidden />

        <div className="flex-1 min-w-0 space-y-1">
          <Label
            htmlFor={`${labelUr}-ur`}
            className="font-urdu block text-right"
            dir="rtl"
          >
            {labelUr}
          </Label>
          {type === "cnic" ? (
            <CNICFieldInput
              value={urValue}
              onChange={handleUrChange}
              active={activeLanguage === "ur"}
              onFocus={handleUrFocus}
            />
          ) : (
            <BilingualTextInput
              language="ur"
              value={value.ur}
              onChange={handleUrChange}
              active={activeLanguage === "ur"}
              onFocus={handleUrFocus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
