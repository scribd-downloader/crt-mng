"use client";

import React, { useState, useEffect } from "react";
import {
  Calculator,
  X,
  Calendar,
  Check,
  Copy,
  User,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CertificateType, CertificateData, MarriageCertificateData, DateValue } from "@/types/certificate";

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  remainingDaysForWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isValid: boolean;
  errorMessage?: string;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate(); // month is 1-indexed
}

export function calculateExactAge(
  dobYear: number,
  dobMonth: number,
  dobDay: number,
  targetYear: number,
  targetMonth: number,
  targetDay: number
): AgeCalculationResult {
  if (
    !dobYear || !dobMonth || !dobDay ||
    !targetYear || !targetMonth || !targetDay ||
    isNaN(dobYear) || isNaN(dobMonth) || isNaN(dobDay) ||
    isNaN(targetYear) || isNaN(targetMonth) || isNaN(targetDay)
  ) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      totalWeeks: 0,
      remainingDaysForWeeks: 0,
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0,
      isValid: false,
      errorMessage: "Please enter complete and valid dates.",
    };
  }

  const maxDobDays = getDaysInMonth(dobYear, dobMonth);
  const maxTargetDays = getDaysInMonth(targetYear, targetMonth);

  // Auto-clamp days to month maximums defensively
  const safeDobDay = Math.min(Math.max(1, dobDay), maxDobDays);
  const safeTargetDay = Math.min(Math.max(1, targetDay), maxTargetDays);

  const dobUtc = Date.UTC(dobYear, dobMonth - 1, safeDobDay);
  const targetUtc = Date.UTC(targetYear, targetMonth - 1, safeTargetDay);

  if (targetUtc < dobUtc) {
    return {
      years: 0, months: 0, days: 0, totalMonths: 0, totalWeeks: 0,
      remainingDaysForWeeks: 0, totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0,
      isValid: false,
      errorMessage: "Date of Marriage / Target Date cannot be before Date of Birth.",
    };
  }

  let y1 = dobYear;
  let m1 = dobMonth;
  let d1 = safeDobDay;

  let y2 = targetYear;
  let m2 = targetMonth;
  let d2 = safeTargetDay;

  let days = d2 - d1;
  let months = m2 - m1;
  let years = y2 - y1;

  if (days < 0) {
    let prevMonth = m2 - 1;
    let prevYear = y2;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const daysInPrev = getDaysInMonth(prevYear, prevMonth);
    days += daysInPrev;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffMs = targetUtc - dobUtc;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalMonths = years * 12 + months;
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysForWeeks = totalDays % 7;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    remainingDaysForWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    isValid: true,
  };
}

const MONTH_NAMES = [
  { value: 1, label: "Jan (01)" },
  { value: 2, label: "Feb (02)" },
  { value: 3, label: "Mar (03)" },
  { value: 4, label: "Apr (04)" },
  { value: 5, label: "May (05)" },
  { value: 6, label: "Jun (06)" },
  { value: 7, label: "Jul (07)" },
  { value: 8, label: "Aug (08)" },
  { value: 9, label: "Sep (09)" },
  { value: 10, label: "Oct (10)" },
  { value: 11, label: "Nov (11)" },
  { value: 12, label: "Dec (12)" },
];

interface AgeCalculatorModalProps<T extends CertificateData> {
  isOpen: boolean;
  onClose: () => void;
  certificateType?: CertificateType;
  certificateData?: T;
  onApplyAge?: (ageYears: string, ageMonths: string, ageDays: string, target?: "groom" | "bride") => void;
}

export function AgeCalculatorModal<T extends CertificateData>({
  isOpen,
  onClose,
  certificateType,
  certificateData,
  onApplyAge,
}: AgeCalculatorModalProps<T>) {
  const isMarriage = certificateType === "marriage";
  const marriageData = isMarriage ? (certificateData as MarriageCertificateData) : null;

  const today = new Date();
  const defaultTargetDate: DateValue = marriageData?.dateOfMarriage?.year
    ? marriageData.dateOfMarriage
    : {
        day: String(today.getDate()).padStart(2, "0"),
        month: String(today.getMonth() + 1).padStart(2, "0"),
        year: String(today.getFullYear()),
      };

  // State for DOB and Target Date
  const [dobDay, setDobDay] = useState<string>("15");
  const [dobMonth, setDobMonth] = useState<string>("01");
  const [dobYear, setDobYear] = useState<string>("1998");

  const [targetDay, setTargetDay] = useState<string>(defaultTargetDate.day || "14");
  const [targetMonth, setTargetMonth] = useState<string>(defaultTargetDate.month || "08");
  const [targetYear, setTargetYear] = useState<string>(defaultTargetDate.year || "2026");

  const [copied, setCopied] = useState(false);
  const [appliedMessage, setAppliedMessage] = useState("");

  const maxDobDays = getDaysInMonth(parseInt(dobYear, 10) || 2000, parseInt(dobMonth, 10) || 1);
  const maxTargetDays = getDaysInMonth(parseInt(targetYear, 10) || 2026, parseInt(targetMonth, 10) || 1);

  // Auto clamp dobDay if month or year changes and day exceeds max days
  useEffect(() => {
    const d = parseInt(dobDay, 10);
    if (!isNaN(d) && d > maxDobDays) {
      setDobDay(String(maxDobDays).padStart(2, "0"));
    }
  }, [dobMonth, dobYear, dobDay, maxDobDays]);

  // Auto clamp targetDay if month or year changes and day exceeds max days
  useEffect(() => {
    const d = parseInt(targetDay, 10);
    if (!isNaN(d) && d > maxTargetDays) {
      setTargetDay(String(maxTargetDays).padStart(2, "0"));
    }
  }, [targetMonth, targetYear, targetDay, maxTargetDays]);

  // Sync target date from certificate data when opened
  useEffect(() => {
    if (!isOpen) return;

    if (marriageData?.dateOfMarriage?.year) {
      setTargetDay(marriageData.dateOfMarriage.day || "14");
      setTargetMonth(marriageData.dateOfMarriage.month || "08");
      setTargetYear(marriageData.dateOfMarriage.year || "2026");
    }
  }, [isOpen, marriageData]);

  if (!isOpen) return null;

  const res = calculateExactAge(
    parseInt(dobYear, 10),
    parseInt(dobMonth, 10),
    parseInt(dobDay, 10),
    parseInt(targetYear, 10),
    parseInt(targetMonth, 10),
    parseInt(targetDay, 10)
  );

  const handleCopySummary = () => {
    if (!res.isValid) return;
    const text = `Age on ${targetDay}/${targetMonth}/${targetYear}: ${res.years} years, ${res.months} months, ${res.days} days (${res.totalDays.toLocaleString()} total days)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToForm = (targetPerson: "groom" | "bride") => {
    if (!res.isValid) return;
    if (onApplyAge) {
      onApplyAge(String(res.years), String(res.months), String(res.days), targetPerson);
      setAppliedMessage(`Applied ${res.years}y ${res.months}m ${res.days}d to ${targetPerson === "groom" ? "Groom" : "Bride"}!`);
      setTimeout(() => setAppliedMessage(""), 3000);
    }
  };

  const syncDobFromNative = (val: string) => {
    if (!val) return;
    const [y, m, d] = val.split("-");
    if (y && m && d) {
      setDobYear(y);
      setDobMonth(m);
      const clampedD = Math.min(parseInt(d, 10) || 1, getDaysInMonth(parseInt(y, 10), parseInt(m, 10)));
      setDobDay(String(clampedD).padStart(2, "0"));
    }
  };

  const syncTargetFromNative = (val: string) => {
    if (!val) return;
    const [y, m, d] = val.split("-");
    if (y && m && d) {
      setTargetYear(y);
      setTargetMonth(m);
      const clampedD = Math.min(parseInt(d, 10) || 1, getDaysInMonth(parseInt(y, 10), parseInt(m, 10)));
      setTargetDay(String(clampedD).padStart(2, "0"));
    }
  };

  const handleDobDayChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setDobDay("");
      return;
    }
    let num = parseInt(digits, 10);
    if (num > maxDobDays) num = maxDobDays;
    setDobDay(String(num));
  };

  const handleDobDayBlur = () => {
    let num = parseInt(dobDay, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > maxDobDays) num = maxDobDays;
    setDobDay(String(num).padStart(2, "0"));
  };

  const handleTargetDayChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) {
      setTargetDay("");
      return;
    }
    let num = parseInt(digits, 10);
    if (num > maxTargetDays) num = maxTargetDays;
    setTargetDay(String(num));
  };

  const handleTargetDayBlur = () => {
    let num = parseInt(targetDay, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > maxTargetDays) num = maxTargetDays;
    setTargetDay(String(num).padStart(2, "0"));
  };

  const currentDobDayNum = Math.min(Math.max(1, parseInt(dobDay, 10) || 1), maxDobDays);
  const currentTargetDayNum = Math.min(Math.max(1, parseInt(targetDay, 10) || 1), maxTargetDays);

  const nativeDobVal =
    dobYear && dobMonth && dobDay
      ? `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(currentDobDayNum).padStart(2, "0")}`
      : "";

  const nativeTargetVal =
    targetYear && targetMonth && targetDay
      ? `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(currentTargetDayNum).padStart(2, "0")}`
      : "";

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto no-print">
      <div className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-5 py-3 border-b bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-lg shadow-xs">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-tight text-foreground flex items-center gap-1.5">
                Age Calculator
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Calculate exact age in years, months & days
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Applied message toast */}
        {appliedMessage && (
          <div className="mx-4 mt-3 p-2.5 text-xs bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center justify-between font-medium">
            <span>{appliedMessage}</span>
            <Check className="h-3.5 w-3.5 text-green-600" />
          </div>
        )}

        <div className="p-4 space-y-4">
          
          {/* Inputs Section */}
          <div className="space-y-3 bg-muted/30 p-3 rounded-xl border">
            
            {/* 1. Date of Birth Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-xs flex items-center gap-1 text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  Date of Birth (DOB):
                </Label>
                <input
                  type="date"
                  value={nativeDobVal}
                  onChange={(e) => syncDobFromNative(e.target.value)}
                  className="text-[11px] bg-background border rounded px-1.5 py-0.5 cursor-pointer font-mono"
                  title="Pick Date"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {/* Month Dropdown */}
                <select
                  value={parseInt(dobMonth, 10) || 1}
                  onChange={(e) => setDobMonth(String(e.target.value).padStart(2, "0"))}
                  className="h-9 px-1.5 text-xs font-semibold bg-background border border-input rounded-md focus:ring-2 focus:ring-amber-500 w-full"
                >
                  {MONTH_NAMES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* Day Input */}
                <Input
                  type="text"
                  placeholder="DD"
                  maxLength={2}
                  value={dobDay}
                  onChange={(e) => handleDobDayChange(e.target.value)}
                  onBlur={handleDobDayBlur}
                  className="h-9 text-center font-bold text-sm w-full"
                />

                {/* Year Input */}
                <Input
                  type="text"
                  placeholder="YYYY"
                  maxLength={4}
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value.replace(/\D/g, ""))}
                  className="h-9 text-center font-bold text-sm w-full"
                />
              </div>
            </div>

            {/* 2. Age at the Date of / Date of Marriage Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-xs flex items-center gap-1 text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-amber-600" />
                  {isMarriage ? "Date of Marriage (Target):" : "Age at the Date of:"}
                </Label>
                <input
                  type="date"
                  value={nativeTargetVal}
                  onChange={(e) => syncTargetFromNative(e.target.value)}
                  className="text-[11px] bg-background border rounded px-1.5 py-0.5 cursor-pointer font-mono"
                  title="Pick Date"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {/* Month Dropdown */}
                <select
                  value={parseInt(targetMonth, 10) || 1}
                  onChange={(e) => setTargetMonth(String(e.target.value).padStart(2, "0"))}
                  className="h-9 px-1.5 text-xs font-semibold bg-background border border-input rounded-md focus:ring-2 focus:ring-amber-500 w-full"
                >
                  {MONTH_NAMES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>

                {/* Day Input */}
                <Input
                  type="text"
                  placeholder="DD"
                  maxLength={2}
                  value={targetDay}
                  onChange={(e) => handleTargetDayChange(e.target.value)}
                  onBlur={handleTargetDayBlur}
                  className="h-9 text-center font-bold text-sm w-full"
                />

                {/* Year Input */}
                <Input
                  type="text"
                  placeholder="YYYY"
                  maxLength={4}
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value.replace(/\D/g, ""))}
                  className="h-9 text-center font-bold text-sm w-full"
                />
              </div>
            </div>

          </div>

          {/* Error Message if invalid */}
          {!res.isValid && (
            <div className="p-2.5 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 shrink-0 text-red-600" />
              <span>{res.errorMessage}</span>
            </div>
          )}

          {/* Results Output Section */}
          {res.isValid && (
            <div className="space-y-3">
              
              {/* Primary Main Callout */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-primary/5 p-4 rounded-xl border border-emerald-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase font-extrabold tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Calculated Age
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopySummary}
                    className="h-6 text-[11px] px-2 gap-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {res.years} <span className="text-sm font-semibold text-muted-foreground">years</span>{" "}
                  {res.months} <span className="text-sm font-semibold text-muted-foreground">months</span>{" "}
                  {res.days} <span className="text-sm font-semibold text-muted-foreground">days</span>
                </div>

                <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400 font-urdu" dir="rtl">
                  عمر: {res.years} سال، {res.months} ماہ، {res.days} دن
                </div>
              </div>

              {/* Action Buttons to Apply Calculated Age directly to Certificate Form */}
              {isMarriage && onApplyAge && (
                <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Apply to Certificate:
                  </span>
                  <div className="flex w-full sm:w-auto gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApplyToForm("groom")}
                      className="flex-1 sm:flex-initial h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1 shadow-xs"
                    >
                      <User className="h-3.5 w-3.5" /> Groom
                      <ArrowRight className="h-3 w-3 ml-0.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApplyToForm("bride")}
                      className="flex-1 sm:flex-initial h-8 text-xs bg-pink-600 hover:bg-pink-700 text-white gap-1 shadow-xs"
                    >
                      <Heart className="h-3.5 w-3.5" /> Bride
                      <ArrowRight className="h-3 w-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>Age Helper</span>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
