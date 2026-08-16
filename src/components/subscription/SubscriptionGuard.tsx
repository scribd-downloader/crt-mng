"use client";

import { useEffect, useState, useCallback } from "react";
import {
  generateDeviceId,
  storeLicense,
  getStoredLicense,
  isWithinOfflineGrace,
  parseLicensePayload,
  isLicenseExpired,
  type LicenseStatus,
} from "@/lib/license/client";
import { useLicenseStore } from "@/lib/store/app-store";
import { AlertTriangle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/subscription/WhatsAppButton";
import { getExpiredMessage, getSupportMessage } from "@/lib/whatsapp/utils";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { status, isLoading, setStatus, setLoading } = useLicenseStore();
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  const validateLicense = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const deviceId = generateDeviceId();
      const response = await fetch("/api/license/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        const data = await response.json();
        storeLicense(data.token);
        setStatus({
          active: data.active,
          plan: data.plan,
          expiresAt: data.expiresAt,
          daysRemaining: data.daysRemaining ?? 0,
          status: data.status,
        });
        setOfflineMode(false);
        return;
      }

      const errData = await response.json().catch(() => ({}));

      if (response.status === 403) {
        const isDeviceLimit = errData.status === "DEVICE_LIMIT_REACHED" || errData.reason === "DEVICE_LIMIT_EXCEEDED";
        setStatus({
          active: false,
          plan: errData.plan ?? "",
          expiresAt: errData.expiresAt ?? "",
          daysRemaining: errData.daysRemaining ?? 0,
          status: isDeviceLimit ? "DEVICE_LIMIT_REACHED" : (errData.status ?? "EXPIRED"),
        });
        return;
      }

      throw new Error("Validation failed");
    } catch {
      const stored = getStoredLicense();
      const payload = stored ? parseLicensePayload(stored) : null;
      const graceDays = 7;

      if (payload && !isLicenseExpired(payload) && isWithinOfflineGrace(graceDays)) {
        setStatus({
          active: true,
          plan: payload.plan,
          expiresAt: payload.subscriptionExpiry,
          daysRemaining: Math.max(
            0,
            Math.ceil(
              (new Date(payload.subscriptionExpiry).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            )
          ),
          status: "ACTIVE",
        });
        setOfflineMode(true);
      } else {
        setError("Internet connection required to verify your subscription.");
        setStatus(null);
      }
    } finally {
      setLoading(false);
    }
  }, [setStatus, setLoading]);

  useEffect(() => {
    validateLicense();
  }, [validateLicense]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-6 border rounded-lg">
          <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connection Required</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={validateLicense}>Retry</Button>
        </div>
      </div>
    );
  }

  if (status && !status.active) {
    const isDeviceLimit = status.status === "DEVICE_LIMIT_REACHED";

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md p-6 border rounded-lg border-destructive/30">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {isDeviceLimit ? "Device Limit Reached" : "Subscription Locked"}
          </h2>
          <p className="text-muted-foreground mb-2">
            {isDeviceLimit
              ? "You have reached the maximum number of active devices allowed for your account."
              : `Your subscription is currently ${status.status.toLowerCase()}. Document creation and editing are locked.`}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Your local certificate data is safe on this device and will not be deleted.
          </p>
          <WhatsAppButton
            message={
              isDeviceLimit
                ? getSupportMessage(userEmail)
                : getExpiredMessage(userEmail)
            }
            label={isDeviceLimit ? "Contact Support on WhatsApp" : "Renew via WhatsApp"}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {offlineMode && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-sm text-amber-800">
          <WifiOff className="h-4 w-4 shrink-0" />
          Working offline within grace period. Reconnect to revalidate your license.
        </div>
      )}
      {children}
    </>
  );
}
