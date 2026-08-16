"use client";

import { LicensePayload } from "@/lib/license/server";

export const LICENSE_STORAGE_KEY = "cm_license_token";
export const LICENSE_VALIDATED_KEY = "cm_license_validated_at";
export const DEVICE_ID_KEY = "cm_device_id";

export function generateDeviceId(): string {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function getStoredLicense(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LICENSE_STORAGE_KEY);
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_STORAGE_KEY, token);
  localStorage.setItem(LICENSE_VALIDATED_KEY, new Date().toISOString());
}

export function clearLicense(): void {
  localStorage.removeItem(LICENSE_STORAGE_KEY);
  localStorage.removeItem(LICENSE_VALIDATED_KEY);
}

export function getLastValidatedAt(): Date | null {
  const stored = localStorage.getItem(LICENSE_VALIDATED_KEY);
  return stored ? new Date(stored) : null;
}

export function isWithinOfflineGrace(graceDays: number): boolean {
  const lastValidated = getLastValidatedAt();
  if (!lastValidated) return false;
  const graceMs = graceDays * 24 * 60 * 60 * 1000;
  return Date.now() - lastValidated.getTime() < graceMs;
}

export interface LicenseStatus {
  active: boolean;
  plan: string;
  expiresAt: string;
  daysRemaining: number;
  status: string;
  offlineGraceDays: number;
  canUseOffline: boolean;
  requiresRevalidation: boolean;
}

export function parseLicensePayload(token: string): LicensePayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as LicensePayload;
  } catch {
    return null;
  }
}

export function isLicenseExpired(payload: LicensePayload): boolean {
  return new Date(payload.subscriptionExpiry) < new Date();
}
