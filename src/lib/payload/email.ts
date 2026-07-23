import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { resendAdapter } from "@payloadcms/email-resend";

/**
 * Production email adapter, chosen automatically from the environment:
 *   1. RESEND_API_KEY present            → Resend
 *   2. SMTP_HOST present                 → SMTP (nodemailer)
 *   3. neither                           → undefined (Payload logs to console)
 *
 * Powers password-reset emails and any future transactional notifications.
 */
export function buildEmailAdapter() {
  const defaultFromAddress = process.env.EMAIL_FROM_ADDRESS || "noreply@naqijo.com";
  const defaultFromName = process.env.EMAIL_FROM_NAME || "NaqiJo";

  if (process.env.RESEND_API_KEY) {
    return resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromAddress,
      defaultFromName,
    });
  }

  if (process.env.SMTP_HOST) {
    return nodemailerAdapter({
      defaultFromAddress,
      defaultFromName,
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || "" }
          : undefined,
      },
    });
  }

  return undefined;
}
