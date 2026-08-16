import { SignJWT, jwtVerify } from "jose";

export interface LicensePayload {
  userId: string;
  plan: string;
  subscriptionExpiry: string;
  licenseExpiry: string;
  deviceId: string;
  issuedAt: string;
}

function getPrivateKey(): string {
  const key = process.env.LICENSE_PRIVATE_KEY;
  if (!key) {
    throw new Error("LICENSE_PRIVATE_KEY is not configured");
  }
  return key.replace(/\\n/g, "\n");
}

function getPublicKey(): string {
  const key = process.env.LICENSE_PUBLIC_KEY;
  if (!key) {
    throw new Error("LICENSE_PUBLIC_KEY is not configured");
  }
  return key.replace(/\\n/g, "\n");
}

export async function signLicense(payload: LicensePayload): Promise<string> {
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(getPrivateKey()),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expSeconds = Math.floor(new Date(payload.licenseExpiry).getTime() / 1000);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(privateKey);
}

export async function verifyLicense(
  token: string
): Promise<LicensePayload | null> {
  try {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      pemToArrayBuffer(getPublicKey()),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const { payload } = await jwtVerify(token, publicKey);
    return payload as unknown as LicensePayload;
  } catch {
    return null;
  }
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/, "")
    .replace(/-----END [A-Z ]+-----/, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function generateDeviceId(): string {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("cm_device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("cm_device_id", deviceId);
  }
  return deviceId;
}

export const LICENSE_STORAGE_KEY = "cm_license_token";
export const LICENSE_VALIDATED_KEY = "cm_license_validated_at";
