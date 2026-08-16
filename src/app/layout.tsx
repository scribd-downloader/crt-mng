import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/layout/PWARegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Prepare, manage, print and export bilingual certificate applications quickly and professionally.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: appName,
  },
};

export const viewport: Viewport = {
  themeColor: "#8B0000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
