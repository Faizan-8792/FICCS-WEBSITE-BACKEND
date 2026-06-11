import { google } from 'googleapis';

let driveClient = null;
let parsedCreds = null;

export const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];

/**
 * OAuth2 client backed by a long-lived refresh token for a real Google account
 * (works with free Gmail — files are owned by that account and use its 15GB).
 * Preferred over the service account, which has no personal Drive quota.
 */
const buildOAuthClient = () => {
  const id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) return null;
  const oauth2 = new google.auth.OAuth2(id, secret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
};

/** Parse the service-account JSON once (fallback path / Shared Drives). */
const getServiceCreds = () => {
  if (parsedCreds) return parsedCreds;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    parsedCreds = JSON.parse(raw);
  } catch (err) {
    console.error('[drive] GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON:', err.message);
    return null;
  }
  return parsedCreds;
};

const buildServiceAccountClient = () => {
  const creds = getServiceCreds();
  if (!creds?.client_email || !creds?.private_key) return null;
  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: DRIVE_SCOPES,
  });
};

/**
 * Lazily build (and cache) an authenticated Drive v3 client. Prefers OAuth2
 * (personal-account quota) and falls back to the service account (only useful
 * for Shared Drives). Returns null when nothing is configured.
 */
export const getDriveClient = () => {
  if (driveClient) return driveClient;
  const auth = buildOAuthClient() || buildServiceAccountClient();
  if (!auth) return null;
  driveClient = google.drive({ version: 'v3', auth });
  return driveClient;
};

/**
 * Drive export is active only when an auth method AND a destination parent
 * folder are configured.
 */
export const isDriveConfigured = () =>
  Boolean((buildOAuthClient() || getServiceCreds()) && process.env.GDRIVE_PARENT_FOLDER_ID);
