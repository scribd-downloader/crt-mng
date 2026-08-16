"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Delete, Space, X, ArrowUp } from "lucide-react";
import { useAppStore } from "@/lib/store/app-store";

interface KeyItem {
  keyEn: string;
  charNormal: string;
  charShift: string;
}

const KEYBOARD_ROWS: KeyItem[][] = [
  // Row 0 - Number / Symbol Row
  [
    { keyEn: "`", charNormal: "`", charShift: "~" },
    { keyEn: "1", charNormal: "1", charShift: "!" },
    { keyEn: "2", charNormal: "2", charShift: "@" },
    { keyEn: "3", charNormal: "3", charShift: "#" },
    { keyEn: "4", charNormal: "4", charShift: "$" },
    { keyEn: "5", charNormal: "5", charShift: "%" },
    { keyEn: "6", charNormal: "6", charShift: "^" },
    { keyEn: "7", charNormal: "7", charShift: "؀" },
    { keyEn: "8", charNormal: "8", charShift: "*" },
    { keyEn: "9", charNormal: "9", charShift: ")" },
    { keyEn: "0", charNormal: "0", charShift: "(" },
    { keyEn: "-", charNormal: "-", charShift: "_" },
    { keyEn: "=", charNormal: "=", charShift: "+" },
  ],
  // Row 1 - Top Row
  [
    { keyEn: "q", charNormal: "ط", charShift: "ظ" },
    { keyEn: "w", charNormal: "ص", charShift: "ض" },
    { keyEn: "e", charNormal: "ھ", charShift: "ذ" },
    { keyEn: "r", charNormal: "د", charShift: "ڈ" },
    { keyEn: "t", charNormal: "ٹ", charShift: "ث" },
    { keyEn: "y", charNormal: "پ", charShift: "ً" },
    { keyEn: "u", charNormal: "ت", charShift: "ۃ" },
    { keyEn: "i", charNormal: "ب", charShift: "ِ" },
    { keyEn: "o", charNormal: "ج", charShift: "چ" },
    { keyEn: "p", charNormal: "ح", charShift: "خ" },
    { keyEn: "[", charNormal: "]", charShift: "}" },
    { keyEn: "]", charNormal: "[", charShift: "{" },
    { keyEn: "\\", charNormal: "\\", charShift: "|" },
  ],
  // Row 2 - Home Row
  [
    { keyEn: "a", charNormal: "م", charShift: "ژ" },
    { keyEn: "s", charNormal: "و", charShift: "ز" },
    { keyEn: "d", charNormal: "ر", charShift: "ڑ" },
    { keyEn: "f", charNormal: "ن", charShift: "ں" },
    { keyEn: "g", charNormal: "ل", charShift: "ۂ" },
    { keyEn: "h", charNormal: "ہ", charShift: "ء" },
    { keyEn: "j", charNormal: "ا", charShift: "آ" },
    { keyEn: "k", charNormal: "ک", charShift: "گ" },
    { keyEn: "l", charNormal: "ی", charShift: "ی" },
    { keyEn: ";", charNormal: "؛", charShift: ":" },
    { keyEn: "'", charNormal: "'", charShift: '"' },
  ],
  // Row 3 - Bottom Row
  [
    { keyEn: "\\", charNormal: "\\", charShift: "|" },
    { keyEn: "z", charNormal: "ق", charShift: "ق" },
    { keyEn: "x", charNormal: "ف", charShift: "ف" },
    { keyEn: "c", charNormal: "ے", charShift: "ۓ" },
    { keyEn: "v", charNormal: "س", charShift: "ؤ" },
    { keyEn: "b", charNormal: "ش", charShift: "ئ" },
    { keyEn: "n", charNormal: "غ", charShift: "ئ" },
    { keyEn: "m", charNormal: "ع", charShift: "ع" },
    { keyEn: ",", charNormal: "،", charShift: ">" },
    { keyEn: ".", charNormal: "-", charShift: "<" },
    { keyEn: "/", charNormal: "/", charShift: "؟" },
  ],
];

interface UrduKeyboardProps {
  onKeyPress: (char: string) => void;
}

export function UrduKeyboard({ onKeyPress }: UrduKeyboardProps) {
  const [isShift, setIsShift] = useState(false);
  const toggleUrduKeyboard = useAppStore((s) => s.toggleUrduKeyboard);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShift(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShift(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 z-50 bg-card/98 backdrop-blur-md text-card-foreground border border-border shadow-2xl rounded-xl p-1.5 no-print max-w-md w-[95%] sm:w-full transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-border mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isShift ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`} />
          <span className="text-[11px] font-bold text-foreground">
            Urdu Keyboard {isShift ? "(Shift)" : ""}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-foreground rounded-full"
          onClick={toggleUrduKeyboard}
          type="button"
          title="Close Keyboard"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        {/* Render 4 Rows of Keys */}
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-0.5 sm:gap-1">
            {row.map((item, ki) => {
              const currentChar = isShift ? item.charShift : item.charNormal;
              const altChar = isShift ? item.charNormal : item.charShift;

              return (
                <Button
                  key={`${ri}-${ki}-${item.keyEn}`}
                  variant="outline"
                  size="sm"
                  className={`relative flex flex-col items-center justify-between min-w-[20px] sm:min-w-[28px] flex-1 h-7 sm:h-8 px-0.5 border rounded shadow-2xs group transition-all select-none ${
                    isShift
                      ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                      : "bg-background hover:bg-accent border-input"
                  }`}
                  onClick={() => onKeyPress(currentChar)}
                  type="button"
                  title={`Key: ${item.keyEn} | Normal: ${item.charNormal} | Shift: ${item.charShift}`}
                >
                  {/* Top En Key & Alt Preview */}
                  <div className="w-full flex items-center justify-between text-[7px] sm:text-[8px] font-mono leading-none text-muted-foreground shrink-0">
                    <span className="font-bold opacity-75">{item.keyEn}</span>
                    {altChar !== currentChar && (
                      <span className="text-[8px] opacity-35" style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
                        {altChar}
                      </span>
                    )}
                  </div>

                  {/* Main Active Character Display - Clean Sizing */}
                  <span
                    className={`text-[10px] sm:text-xs font-bold leading-none select-none ${
                      isShift ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                    style={{ fontFamily: '"Segoe UI", "Segoe UI Urdu", "Noto Sans Arabic", Tahoma, sans-serif' }}
                  >
                    {currentChar}
                  </span>
                </Button>
              );
            })}
          </div>
        ))}

        {/* Bottom Control Row */}
        <div className="flex justify-center gap-1 pt-0.5 border-t border-border/50">
          <Button
            variant={isShift ? "default" : "outline"}
            size="sm"
            className={`h-6.5 px-2 text-[10px] gap-1 font-semibold ${
              isShift ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
            }`}
            onClick={() => setIsShift(!isShift)}
            type="button"
          >
            <ArrowUp className="h-3 w-3" /> Shift
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 max-w-[140px] h-6.5 text-[10px] font-medium"
            onClick={() => onKeyPress(" ")}
            type="button"
          >
            <Space className="h-3 w-3 mr-1" /> Space
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-6.5 px-2 text-[10px] font-medium"
            onClick={() => onKeyPress("Backspace")}
            type="button"
          >
            <Delete className="h-3 w-3 mr-1" /> Back
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6.5 px-2 text-[10px] font-medium text-destructive hover:bg-destructive/10"
            onClick={() => onKeyPress("")}
            type="button"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}



