/**
 * One-off: notify membership applicants (pending, account-linked) that their
 * uploaded documents were lost and they should re-apply. Talks to the LIVE API
 * as admin (not the DB directly). Safe to delete after running.
 *
 * Usage: node scripts/sendReapplyNotice.js
 */
import dotenv from 'dotenv';
dotenv.config();

const API = process.env.NOTICE_API_BASE || 'https://api.ficcs.org.in/api';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

const TITLE = 'Action needed: Please re-submit your membership documents';
const BODY = `Dear Applicant,

Thank you for applying for FICCS membership. Due to a recent technical update on our servers, some uploaded documents (photos/certificates) from earlier applications could not be saved correctly.

To complete your membership review, please re-submit your application with the required documents once more. It only takes a few minutes:

Visit ficcs.org.in -> Membership -> Apply

We sincerely apologize for the inconvenience and appreciate your patience. If you face any issue, reply to this message or contact us at Theficcs.india@gmail.com.

Warm regards,
FICCS Team`;

const die = (msg, detail) => {
  console.error(detail === undefined ? msg : `${msg}:`, detail ?? '');
  process.exit(1);
};

/**
 * Single fetch wrapper: injects JSON + bearer headers, parses the body
 * (tolerating non-JSON error pages), and returns { ok, status, data }.
 */
const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
};

const run = async () => {
  if (!EMAIL || !PASSWORD) {
    die('ADMIN_EMAIL / ADMIN_PASSWORD missing in .env');
  }

  // 1. Login as admin
  const login = await request('/auth/login', {
    method: 'POST',
    body: { email: EMAIL, password: PASSWORD },
  });
  if (!login.ok || !login.data?.token) {
    die('Login failed', login.data);
  }
  const token = login.data.token;
  console.log('Admin logged in.');

  // 2. Fetch applications + users
  const [membershipsRes, usersRes] = await Promise.all([
    request('/memberships', { token }),
    request('/users', { token }),
  ]);
  const memberships = membershipsRes.data;
  const users = usersRes.data;

  if (!Array.isArray(memberships) || !Array.isArray(users)) {
    die('Unexpected response', { memberships, users });
  }

  const userById = new Map(users.map((u) => [u.id ?? u._id, u]));

  // 3. Applicants with a linked, still-pending user account
  const recipientIds = [];
  let unlinked = 0;
  let alreadyMember = 0;
  for (const m of memberships) {
    const uid = m.userId;
    if (!uid) { unlinked += 1; continue; }
    const user = userById.get(uid);
    if (!user) { unlinked += 1; continue; }
    if (user.role === 'admin' || user.status === 'approved') { alreadyMember += 1; continue; }
    if (!recipientIds.includes(uid)) recipientIds.push(uid);
  }

  console.log(`Applications: ${memberships.length}`);
  console.log(`Unreachable (no linked account): ${unlinked}`);
  console.log(`Skipped (already member/admin): ${alreadyMember}`);
  console.log(`Will notify (unique pending applicants): ${recipientIds.length}`);

  if (recipientIds.length === 0) {
    console.log('No reachable recipients. Nothing sent.');
    process.exit(0);
  }

  // 4. Send selective message
  const send = await request('/messages', {
    method: 'POST',
    token,
    body: { title: TITLE, body: BODY, audience: 'selective', recipientIds },
  });
  if (!send.ok) {
    die('Send failed', send.data);
  }

  console.log(`\nMessage sent to ${recipientIds.length} applicants.`);
  process.exit(0);
};

run().catch((e) => die(String(e?.stack || e)));
