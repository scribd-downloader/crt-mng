export function formatCNIC(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

export function formatDateParts(
  day: string,
  month: string,
  year: string
): string {
  const d = day.padStart(2, "0");
  const m = month.padStart(2, "0");
  const y = year.padStart(4, "0");
  if (!day && !month && !year) return "";
  return `${d} / ${m} / ${y}`;
}

export function parseDateParts(dateStr: string): {
  day: string;
  month: string;
  year: string;
} {
  const parts = dateStr.split(/[/\-.]/).map((p) => p.trim());
  return {
    day: parts[0] || "",
    month: parts[1] || "",
    year: parts[2] || "",
  };
}

export function generateDocumentNumber(
  prefix: string,
  sequence: number
): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(6, "0")}`;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
