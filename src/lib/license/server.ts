import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";

export interface LicensePayload {
  userId: string;
  plan: string;
  subscriptionExpiry: string;
  licenseExpiry: string;
  deviceId: string;
  issuedAt: string;
}

const FALLBACK_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvJ5M8gRzc9ZU0\nVUj/2Ues8UaSngJz4h2wApUi1WDdZYW6/Xqbya1JphwlDEwR5QEbT46/gkIoSUyl\nSsAqs0E8UfT0wr4+sH8V2KPADyr67isIk4IO8dIvgbdDml83h9raOND3VBEzY2y+\nu8ReB7JksD/XqOqFQQ02K3V7QWzWiqoOMUHoo5RV/Z5EI50/ur5cAuI4qIE/w+jM\nQrTHoG9ll2Fuvtb0QfiMXvjFHfON/NgHz5onx7wCkOSVbo79kjy37K/aWopckNQr\naCNjn8V1u6Ey76pOPBlSA1WtmOG4bh4NA2GgHrbVob5odJezZq1Vfm8Rm/BZqCAU\nHOLPnHdNAgMBAAECgf8yUXNTJHptWuyylmzzV5H+WLLZnzt12+j1Zi7vGfz7Tdyd\nRLeLN0tmYsECxzjPB64qa8/jUPdmlb7vHhXBYc7hmT3Iw1y2lK4bQGLQOQLCE8ZO\nygY63nadHixz+EMYdST1nR5UbHRibjvupjXGW9YaC5kvNmuJ+QE74SPWb5dah6xp\n4agUbbs/RtAryQ4Tt9w/3tm6B0NYZJZKkFD0lu3T/9Orj+zMOBxeQSYhJhvghfQJ\nkHoJMsYtYcfnFEkeLnhLFiLRffhZQ9v6LiVaLxo1Jnc494JoqXwqjb0uocFP3U0q\n+sbEfJR6Hu0OjBNpX6hnvOkVOSrPtk6Zt2DLdGMCgYEA2Yegda+JxvY4jToXi3a7\nt2l697ECkzKzyHAc/UgviSMJqQycPuWs+W31Ey8Hq8SRJ/S4AMBazfLdbOY3ZR4c\nGgS4gg/B66Pz5p0+gYOuPpacaWuZSxHgrkj8Ii/qMvFCZt4oI+uNbblIgibYD5uZ\nT0OfBlpDIQZEdw635pwnB78CgYEAziF3m26acKJ1dB4MSc27DvMoijJJBp/+YJRS\nemZH9NtX4nQegtjSlBsracy+ny7VrAjb31SFr8LPa/EQ1ldvN10RgABCQcFsv3XQ\nP15PyOIIaglwNnpgqSrZ+FiJz2xUKcj4mNFk384Qg048bDwQMNpi+HtRwDy4JKBK\nQce/I/MCgYEAwjWLdead3IuRW81EnhgIaiz7Q06+3MqEpmwqBZvADPDCPDJtAN6v\nexXHmzP+5kUdz412Bf22VG8Db6luRZIHRtd2H3CQEqCTLg6vcpQtKeXviVMuTk6M\nyS2SJbefoZGyVgL71W4FG7QzXzfs6Kpjyte1j8dgbYiZ8a2rVHGPiyMCgYA2v97j\n8uGkbxIhUGXVKIa5ts4avrZ0wwQupNavWgFcwPG73TnJaUutOPYz+MTcxPTN5+B2\nlh2YDHdJZVMii0CoBNlEFU2D55s501IHssYgRiEUAQPEBIcuB4qzktivtkc4ff/B\nn0RayYHLTnlwChgG0cqd0ytokvgaClUO2b4kDwKBgQDTOaQw9MjWxXDVO2iuFXxd\nnzVBpImFM678HCQW/07+JKcczD6g2oGZupC9Pkpajhnu0BqFa1e4vhxfAfK4XSIU\niR4dJ/p4bbJ7toW5/OoOoRc5zOEhLxE1mNhYGc2WVyL9m4cKh9t96It/YdV20+pq\noX4p8gh+82PpSiYCJchJZw==\n-----END PRIVATE KEY-----\n`;

const FALLBACK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAryeTPIEc3PWVNFVI/9lH\nrPFGkp4Cc+IdsAKVItVg3WWFuv16m8mtSaYcJQxMEeUBG0+Ov4JCKElMpUrAKrNB\nPFH09MK+PrB/FdijwA8q+u4rCJOCDvHSL4G3Q5pfN4fa2jjQ91QRM2NsvrvEXgey\nZLA/16jqhUENNit1e0Fs1oqqDjFB6KOUVf2eRCOdP7q+XALiOKiBP8PozEK0x6Bv\nZZdhbr7W9EH4jF74xR3zjfzYB8+aJ8e8ApDklW6O/ZI8t+yv2lqKXJDUK2gjY5/F\ndbuhMu+qTjwZUgNVrZjhuG4eDQNhoB621aG+aHSXs2atVX5vEZvwWaggFBziz5x3\nTQIDAQAB\n-----END PUBLIC KEY-----\n`;

function getPrivateKeyPem(): string {
  const key = process.env.LICENSE_PRIVATE_KEY || FALLBACK_PRIVATE_KEY;
  return key.replace(/\\n/g, "\n");
}

function getPublicKeyPem(): string {
  const key = process.env.LICENSE_PUBLIC_KEY || FALLBACK_PUBLIC_KEY;
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
