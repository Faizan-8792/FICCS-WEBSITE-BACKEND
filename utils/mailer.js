import nodemailer from 'nodemailer';

/**
 * Email transport built from environment variables.
 *
 * Required env vars (all must be set for email to send):
 *   SMTP_HOST      e.g. smtp.gmail.com
 *   SMTP_PORT      e.g. 465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER      the mailbox / SMTP username
 *   SMTP_PASS      the SMTP password or app-password (Gmail: App Password)
 *
 * Optional:
 *   MAIL_FROM      "From" address shown to recipients (defaults to SMTP_USER)
 *   CONTACT_NOTIFY_EMAILS  comma-separated recipient list for inquiry alerts
 *
 * If SMTP is not configured, the mailer no-ops gracefully so the rest of the
 * request flow (saving the contact to the DB) is never blocked.
 */

let transporter;

const isConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );

const getTransporter = () => {
  if (transporter) return transporter;
  if (!isConfigured()) return null;

  const port = Number(process.env.SMTP_PORT);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // SSL on 465, STARTTLS otherwise
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/**
 * Resolve the recipient list for contact/inquiry notifications.
 * Falls back to the FICCS inquiry email + the project owner if the explicit
 * CONTACT_NOTIFY_EMAILS var is not set.
 */
export const getContactRecipients = () => {
  const raw = process.env.CONTACT_NOTIFY_EMAILS || '';
  const list = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return list;
};

/**
 * Send an email. Returns true if sent, false if SMTP is not configured or the
 * send failed. Never throws — callers should not be blocked by mail issues.
 */
export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[mailer] SMTP not configured — skipping email send.');
    return false;
  }

  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (!recipients.length) {
    console.warn('[mailer] No recipients provided — skipping email send.');
    return false;
  }

  try {
    await transport.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: recipients.join(','),
      subject,
      text,
      html,
      replyTo,
    });
    return true;
  } catch (error) {
    console.error('[mailer] Failed to send email:', error.message);
    return false;
  }
};

export const isMailerConfigured = isConfigured;
