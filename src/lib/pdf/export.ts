"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SCALE = 3;

export async function exportToJPG(
  elementId: string,
  filename: string
): Promise<void> {
  if (typeof window !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }

  const original = document.getElementById(elementId);
  if (!original) throw new Error("Certificate element not found");

  const clone = original.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.opacity = "1";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "99999";
  clone.style.backgroundColor = "#ffffff";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: SCALE,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
      windowWidth: clone.offsetWidth,
      windowHeight: clone.offsetHeight,
    });

    const link = document.createElement("a");
    link.download = filename.endsWith(".jpg") ? filename : `${filename}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  } finally {
    document.body.removeChild(clone);
  }
}

export async function exportToPDF(
  elementId: string,
  filename: string
): Promise<void> {
  if (typeof window !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }

  const original = document.getElementById(elementId);
  if (!original) throw new Error("Certificate element not found");

  const clone = original.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.opacity = "1";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "99999";
  clone.style.backgroundColor = "#ffffff";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: SCALE,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
      windowWidth: clone.offsetWidth,
      windowHeight: clone.offsetHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
    } else {
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } finally {
    document.body.removeChild(clone);
  }
}

export async function exportToPNG(
  elementId: string,
  filename: string
): Promise<void> {
  if (typeof window !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }

  const original = document.getElementById(elementId);
  if (!original) throw new Error("Certificate element not found");

  const clone = original.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.position = "fixed";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.width = "210mm";
  clone.style.minHeight = "297mm";
  clone.style.height = "auto";
  clone.style.overflow = "visible";
  clone.style.opacity = "1";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "99999";
  clone.style.backgroundColor = "#ffffff";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: SCALE,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: clone.offsetWidth,
      height: clone.offsetHeight,
      windowWidth: clone.offsetWidth,
      windowHeight: clone.offsetHeight,
    });

    const link = document.createElement("a");
    link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    document.body.removeChild(clone);
  }
}

export function printCertificate(elementId?: string): void {
  if (typeof window === "undefined") return;

  if (elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      const container = el.closest(".certificate-print-area") as HTMLElement;
      if (container) {
        container.style.opacity = "1";
        container.style.visibility = "visible";
      }
    }
  }

  window.print();
}
