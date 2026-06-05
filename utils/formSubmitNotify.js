import { FICCS_INQUIRY_EMAIL } from './defaultContent.js';

/**
 * Email contact inquiries via FormSubmit (https://formsubmit.co) — a free
 * form-to-email relay that needs no SMTP credentials.
 *
 * The primary recipient is FORMSUBMIT_EMAIL (falls back to the live office
 * email, then the FICCS default). The project owner is always CC'd, plus any
 * addresses in CONTACT_NOTIFY_EMAILS.
 *
 * IMPORTANT: FormSubmit requires a one-time activation. The very first POST to
 * a new target address triggers a confirmation email to that inbox; the link
 * must be clicked once before forwarding begins.
 *
 * This never throws — mail issues must not break the contact submission.
 */

const OWNER_NOTIFY_EMAIL = 'saifullahfaizan786@gmail.com';

const buildCcList = (target) => {
  const extras = (process.env.CONTACT_NOTIFY_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const all = [OWNER_NOTIFY_EMAIL, ...extras];
  const targetLower = (target || '').toLowerCase();

  return [
    ...new Set(
      all
        .map((entry) => entry.toLowerCase())
        .filter((entry) => entry && entry !== targetLower)
    ),
  ];
};

export const sendInquiryViaFormSubmit = async ({ name, email, message }, officeEmail) => {
  const target = process.env.FORMSUBMIT_EMAIL || officeEmail || FICCS_INQUIRY_EMAIL;
  if (!target) {
    console.warn('[formsubmit] No target email resolved — skipping send.');
    return false;
  }

  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(target)}`;
  const cc = buildCcList(target);

  const payload = {
    name,
    email,
    message,
    _subject: `New FICCS inquiry from ${name}`,
    _template: 'table',
    _captcha: 'false',
  };
  if (cc.length) payload._cc = cc.join(',');

  try {
    const origin = process.env.CLIENT_URL || 'https://ficcs.org.in';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // FormSubmit rejects requests with no browser context. Presenting the
        // site origin satisfies its anti-abuse referer/origin check.
        Origin: origin,
        Referer: origin,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || String(data.success) === 'false') {
      console.error(
        '[formsubmit] send failed:',
        data.message || `HTTP ${response.status}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('[formsubmit] error:', error.message);
    return false;
  }
};
