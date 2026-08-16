"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store/app-store";
import { UrduKeyboard } from "@/components/keyboard/UrduKeyboard";
import { SubscriptionGuard } from "@/components/subscription/SubscriptionGuard";
import { exportToJPG, exportToPDF, exportToPNG, printCertificate } from "@/lib/pdf/export";
import {
  saveDraft,
  getDraft,
  saveDocument,
  getNextDocumentNumber,
} from "@/lib/indexeddb/database";
import type { CertificateType, CertificateData, MarriageCertificateData } from "@/types/certificate";
import { Download, Printer, Save, RotateCcw, FileImage, FileText, Maximize2, Eye, Edit3, X, Calculator } from "lucide-react";
import { AgeCalculatorModal } from "@/components/calculator/AgeCalculatorModal";

interface CertificateEditorProps<T extends CertificateData> {
  type: CertificateType;
  title: string;
  initialData: T;
  demoData?: T;
  FormComponent: React.ComponentType<{
    data: T;
    onChange: (data: T) => void;
    activeLanguage: "en" | "ur";
  }>;
  DocumentComponent: React.ComponentType<{ data: T; id?: string }>;
}

export function CertificateEditor<T extends CertificateData>({
  type,
  title,
  initialData,
  demoData,
  FormComponent,
  DocumentComponent,
}: CertificateEditorProps<T>) {
  const [data, setData] = useState<T>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showFullViewModal, setShowFullViewModal] = useState(false);
  const [showAgeCalculator, setShowAgeCalculator] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputLanguage = useAppStore((s) => s.inputLanguage);
  const setInputLanguage = useAppStore((s) => s.setInputLanguage);
  const showUrduKeyboard = useAppStore((s) => s.showUrduKeyboard);
  const toggleUrduKeyboard = useAppStore((s) => s.toggleUrduKeyboard);

  const docId = "certificate-document";

  useEffect(() => {
    getDraft(type).then((draft) => {
      if (draft?.data) {
        setData(draft.data as T);
      }
    });
  }, [type]);

  const autosave = useCallback(
    (newData: T) => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(async () => {
        await saveDraft({
          id: `${type}-draft`,
          type,
          data: newData,
          updatedAt: new Date().toISOString(),
        });
      }, 1500);
    },
    [type]
  );

  const handleChange = (newData: T) => {
    setData(newData);
    autosave(newData);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docNumber = await getNextDocumentNumber(type);
      const now = new Date().toISOString();
      await saveDocument({
        id: uuidv4(),
        type,
        title: `${title} - ${docNumber}`,
        data,
        documentNumber: docNumber,
        createdAt: now,
        updatedAt: now,
      });
      setMessage(`Saved as ${docNumber}`);
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: "jpg" | "png" | "pdf") => {
    try {
      const docNumber = await getNextDocumentNumber(type);
      const filename = `${title.replace(/\s+/g, "-")}-${docNumber}`;
      if (format === "jpg") {
        await exportToJPG(docId, `${filename}.jpg`);
      } else if (format === "png") {
        await exportToPNG(docId, `${filename}.png`);
      } else {
        await exportToPDF(docId, `${filename}.pdf`);
      }
    } catch {
      setMessage(`${format.toUpperCase()} export failed`);
    }
  };

  const handleReset = () => {
    if (confirm("Reset form? Unsaved changes will be lost.")) {
      setData(initialData);
    }
  };

  const handleApplyAge = (years: string, months: string, days: string, target?: "groom" | "bride") => {
    if (type === "marriage") {
      const marriageData = data as unknown as MarriageCertificateData;
      if (target === "groom") {
        const updated = {
          ...marriageData,
          groom: {
            ...marriageData.groom,
            ageYears: years,
            ageMonths: months,
            ageDays: days,
          },
        };
        handleChange(updated as unknown as T);
      } else if (target === "bride") {
        const updated = {
          ...marriageData,
          bride: {
            ...marriageData.bride,
            ageYears: years,
            ageMonths: months,
            ageDays: days,
          },
        };
        handleChange(updated as unknown as T);
      }
    }
  };

  const loadDemo = () => {
    if (demoData) setData(demoData);
  };

  const handleUrduKey = (char: string) => {
    const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    if (!active || (active.tagName !== "INPUT" && active.tagName !== "TEXTAREA")) {
      return;
    }

    const start = active.selectionStart ?? active.value.length;
    const end = active.selectionEnd ?? start;
    let newValue = active.value;
    let cursor = start;

    if (char === "Backspace") {
      if (start === end && start > 0) {
        newValue = active.value.slice(0, start - 1) + active.value.slice(end);
        cursor = start - 1;
      } else {
        newValue = active.value.slice(0, start) + active.value.slice(end);
        cursor = start;
      }
    } else if (char === "") {
      newValue = "";
      cursor = 0;
    } else if (char === "\n") {
      return;
    } else {
      newValue = active.value.slice(0, start) + char + active.value.slice(end);
      cursor = start + char.length;
    }

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(active, newValue);
    active.dispatchEvent(new Event("input", { bubbles: true }));
    active.setSelectionRange(cursor, cursor);
  };

  return (
    <SubscriptionGuard>
      <div className="space-y-4">
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border rounded-xl p-4 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">Fill bilingual fields on the left window; live mini-preview on the right 200x300px card</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Tabs
              value={inputLanguage}
              onValueChange={(v) => setInputLanguage(v as "en" | "ur")}
            >
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ur" className="font-urdu">اردو</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant={showUrduKeyboard ? "default" : "outline"}
              size="sm"
              onClick={toggleUrduKeyboard}
            >
              Urdu Keyboard
            </Button>
          </div>
        </div>

        {message && (
          <div className="p-3 text-sm bg-green-50 border border-green-200 text-green-800 rounded-md font-medium">{message}</div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-xl border">
          <div className="flex flex-wrap gap-2 no-print">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-1.5" /> Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 mr-1.5 text-red-600" /> Save A4 PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport("jpg")}>
              <FileImage className="h-4 w-4 mr-1.5 text-blue-600" /> Save A4 JPG
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExport("png")}>
              <FileImage className="h-4 w-4 mr-1.5 text-green-600" /> Save A4 PNG
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAgeCalculator(true)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300/80 font-medium"
            >
              <Calculator className="h-4 w-4 mr-1.5 text-amber-600" /> Age Calculator
            </Button>
            <Button size="sm" variant="outline" onClick={() => printCertificate()}>
              <Printer className="h-4 w-4 mr-1.5" /> Print A4 Paper
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1.5" /> Reset Form
            </Button>
            {demoData && (
              <Button size="sm" variant="ghost" onClick={loadDemo}>
                <Download className="h-4 w-4 mr-1.5" /> Load Sample Data
              </Button>
            )}
          </div>

          <Button
            size="sm"
            variant="default"
            onClick={() => setShowFullViewModal(true)}
            className="bg-primary text-primary-foreground shadow"
          >
            <Maximize2 className="h-4 w-4 mr-1.5" /> View Full A4 Certificate
          </Button>
        </div>

        {/* 2-Window Responsive Layout: Left = Wide Input Form, Right = Fixed 200x300 Card */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Window: Wide Input Form */}
          <div className="flex-1 w-full bg-card border rounded-xl p-5 shadow-sm no-print max-h-[calc(100vh-180px)] overflow-y-auto">
            <div className="border-b pb-3 mb-4 flex justify-between items-center">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Edit3 className="h-4.5 w-4.5 text-primary" /> Certificate Fields Window
              </h2>
              <span className="text-xs text-muted-foreground">All changes update live</span>
            </div>
            <FormComponent
              data={data}
              onChange={handleChange}
              activeLanguage={inputLanguage}
            />
          </div>

          {/* Right Window: Fixed 200x300px Preview Card */}
          <div className="w-full lg:w-[240px] shrink-0 flex flex-col items-center lg:sticky lg:top-4 bg-card border rounded-xl p-4 shadow-sm space-y-3">
            <div className="text-center w-full border-b pb-2">
              <h3 className="font-bold text-sm text-foreground flex items-center justify-center gap-1.5">
                <Eye className="h-4 w-4 text-certificate-red" /> Card Preview
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">Fixed 200x300 px</span>
            </div>

            {/* 200x300 px Card Container */}
            <div
              className="w-[200px] h-[300px] min-w-[200px] min-h-[300px] bg-white border-2 border-certificate-red rounded-lg shadow-md overflow-hidden relative cursor-pointer group hover:ring-2 hover:ring-primary/50 transition-all flex items-center justify-center"
              onClick={() => setShowFullViewModal(true)}
              title="Click to Expand Full A4 View"
            >
              <div className="w-[794px] h-[1123px] origin-top-left scale-[0.252] pointer-events-none select-none">
                <DocumentComponent data={data} id={`${docId}-thumbnail`} />
              </div>
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5" /> Full A4 View
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs gap-1.5"
              onClick={() => setShowFullViewModal(true)}
            >
              <Maximize2 className="h-3.5 w-3.5" /> View Full Certificate
            </Button>
          </div>
        </div>

        {/* Document Element for PDF/JPG export and Print */}
        <div className="certificate-print-area pointer-events-none fixed top-[-9999px] left-[-9999px] w-[210mm] h-[297mm] max-h-[297mm] overflow-hidden z-[-9999]">
          <DocumentComponent data={data} id={docId} />
        </div>

        {/* Full View Modal Overlay */}
        {showFullViewModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border">
              <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{title} — Complete A4 Preview</h3>
                  <p className="text-xs text-muted-foreground">Standard 210mm x 297mm A4 Paper Print Format</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExport("pdf")}>
                    <FileText className="h-4 w-4 mr-1 text-red-600" /> Save PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleExport("jpg")}>
                    <FileImage className="h-4 w-4 mr-1 text-blue-600" /> Save JPG
                  </Button>
                  <Button size="sm" variant="default" onClick={() => printCertificate(docId)}>
                    <Printer className="h-4 w-4 mr-1" /> Print
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 ml-2 rounded-full"
                    onClick={() => setShowFullViewModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6 bg-slate-200 flex justify-center items-start">
                <div className="bg-white shadow-2xl rounded">
                  <DocumentComponent data={data} id={`${docId}-modal`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {showUrduKeyboard && inputLanguage === "ur" && (
          <UrduKeyboard onKeyPress={handleUrduKey} />
        )}

        <AgeCalculatorModal
          isOpen={showAgeCalculator}
          onClose={() => setShowAgeCalculator(false)}
          certificateType={type}
          certificateData={data}
          onApplyAge={handleApplyAge}
        />
      </div>
    </SubscriptionGuard>
  );
}
