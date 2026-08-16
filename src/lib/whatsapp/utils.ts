export function getWhatsAppUrl(message: string, customNumber?: string): string {
  let number =
    customNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923192012074";
  number = number.replace(/\D/g, "");
  if (number.startsWith("03") && number.length === 11) {
    number = "92" + number.slice(1);
  }
  if (!number) {
    number = "923192012074";
  }
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${number}&text=${encoded}`;
}

export function getRenewalMessage(email?: string): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";
  const emailText = email ? ` My account email is: ${email}` : "";
  return `Hello, I want to renew my ${appName} subscription.${emailText}`;
}

export function getExpiredMessage(email?: string): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";
  const emailText = email ? ` My account email is: ${email}` : "";
  return `Hello, my ${appName} subscription has expired.${emailText}`;
}

export function getPurchaseMessage(plan?: string, email?: string): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";
  const planText = plan ? ` ${plan}` : "";
  const emailText = email ? ` My account email is: ${email}` : "";
  return `Hello, I want to purchase a${planText} ${appName} subscription.${emailText}`;
}

export function getSupportMessage(email?: string): string {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";
  const emailText = email ? ` My account email is: ${email}` : "";
  return `Hello, I need support with ${appName}.${emailText}`;
}
