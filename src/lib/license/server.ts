import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";

export interface LicensePayload {
  userId: string;
  plan: string;
  subscriptionExpiry: string;
  licenseExpiry: string;
  deviceId: string;
  issuedAt: string;
}

function getPrivateKeyPem(): string {
  const key = process.env.LICENSE_PRIVATE_KEY;
  if (!key) throw new Error("LICENSE_PRIVATE_KEY is not configured");
  return key.replace(/\\n/g, "\n");
}

function getPublicKeyPem(): string {
  const key = process.env.LICENSE_PUBLIC_KEY;
  if (!key) throw new Error("LICENSE_PUBLIC_KEY is not configured");
  return key.replace(/\\n/g, "\n");
}

export async function signLicense(payload: LicensePayload): Promise<string> {
  const privateKey = await importPKCS8(getPrivateKeyPem(), "RS256");
  const expSeconds = Math.floor(new Date(payload.licenseExpiry).getTime() / 1000);
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(privateKey);
}

export async function verifyLicenseToken(
  token: string
): Promise<LicensePayload | null> {
  try {
    const publicKey = await importSPKI(getPublicKeyPem(), "RS256");
    const { payload } = await jwtVerify(token, publicKey);
    return payload as unknown as LicensePayload;
  } catch {
    return null;
  }
}

export const LICENSE_STORAGE_KEY = "cm_license_token";
export const LICENSE_VALIDATED_KEY = "cm_license_validated_at";

export function getOfflineGraceDays(): number {
  return parseInt(process.env.OFFLINE_GRACE_DAYS || "7", 10);
}

export function getLicenseValidityHours(): number {
  return parseInt(process.env.LICENSE_VALIDITY_HOURS || "168", 10);
}
