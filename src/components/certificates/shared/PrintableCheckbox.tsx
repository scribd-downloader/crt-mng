"use client";

import { cn } from "@/components/ui/utils";

interface PrintableCheckboxProps {
  checked: boolean;
  label?: string;
  labelUr?: string;
  className?: string;
}

export function PrintableCheckbox({
  checked,
  label,
  labelUr,
  className,
}: PrintableCheckboxProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center w-[16px] h-[16px] border-[1.5px] border-certificate-red text-[13px] font-black leading-none shrink-0 rounded-[2px]",
          checked ? "bg-red-50 text-slate-950 font-black" : "text-transparent bg-white"
        )}
      >
        {checked ? "✓" : ""}
      </span>
      {label && <span className={cn("text-[12px]", checked ? "font-extrabold text-slate-950" : "text-slate-700")}>{label}</span>}
      {labelUr && (
        <span className={cn("font-urdu text-[12px]", checked ? "font-extrabold text-slate-950" : "text-slate-700")} dir="rtl">
          {labelUr}
        </span>
      )}
    </span>
  );
}

interface PrintableCheckboxGroupProps {
  options: { value: string; labelEn: string; labelUr: string }[];
  selected: string;
  className?: string;
}

export function PrintableCheckboxGroup({
  options,
  selected,
  className,
}: PrintableCheckboxGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-x-2 gap-y-0.5", className)}>
      {options.map((opt) => (
        <PrintableCheckbox
          key={opt.value}
          checked={selected === opt.value}
          label={opt.labelEn}
        />
      ))}
      <span className="mx-1">|</span>
      {options.map((opt) => (
        <PrintableCheckbox
          key={`ur-${opt.value}`}
          checked={selected === opt.value}
          labelUr={opt.labelUr}
        />
      ))}
    </div>
  );
}
