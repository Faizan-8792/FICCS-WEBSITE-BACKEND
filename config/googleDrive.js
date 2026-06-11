import { google } from 'googleapis';

let driveClient = null;
let parsedCreds = null;

/**
 * Parse the service-account JSON once. Stored as a single env var
 * GOOGLE_SERVICE_ACCOUNT_JSON (the full JSON the Google console gives you).
 */
const getCreds = () => {
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

/**
 * Lazily build (and cache) an authenticated Drive v3 client from the service
 * account credentials. Returns null when credentials are missing/invalid so
 * callers can gracefully skip the Drive export.
 */
export const getDriveClient = () => {
  if (driveClient) return driveClient;
  const creds = getCreds();
  if (!creds?.client_email || !creds?.private_key) return null;

  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  driveClient = google.drive({ version: 'v3', auth });
  return driveClient;
};

/**
 * Drive export is only active when BOTH the credentials and a destination
 * parent folder (shared with the service account) are configured.
 */
export const isDriveConfigured = () =>
  Boolean(getCreds() && process.env.GDRIVE_PARENT_FOLDER_ID);
