import { Resend } from "resend";

let resend: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set — emails will not be sent");
    return null;
  }
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

export function getFromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL || "MedCare Hospital <onboarding@resend.dev>"
  );
}
