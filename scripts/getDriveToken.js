/**
 * One-time helper to obtain a Google OAuth2 refresh token for Drive uploads
 * using a normal (free) Google account.
 *
 * Prerequisites:
 *   1. In Google Cloud Console → APIs & Services → Credentials, create an
 *      "OAuth client ID" of type "Web application".
 *   2. Add this Authorized redirect URI:  http://localhost:53682
 *   3. Put the client id/secret in backend/.env as:
 *        GOOGLE_OAUTH_CLIENT_ID=...
 *        GOOGLE_OAUTH_CLIENT_SECRET=...
 *
 * Run:  node scripts/getDriveToken.js
 * It prints a consent URL, you approve in the browser with the Google account
 * that OWNS the destination Drive folder, and it prints the refresh token to
 * paste into GOOGLE_OAUTH_REFRESH_TOKEN.
 */
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config();
import { google } from 'googleapis';
import { DRIVE_SCOPES } from '../config/googleDrive.js';

const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}`;

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env first.');
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // force a refresh_token every time
  scope: DRIVE_SCOPES,
});

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, REDIRECT_URI);
    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400).end('Missing ?code');
      return;
    }
    const { tokens } = await oauth2.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h2>Done. Refresh token printed in your terminal. You can close this tab.</h2>');
    console.log('\n==============================================');
    if (tokens.refresh_token) {
      console.log('GOOGLE_OAUTH_REFRESH_TOKEN=' + tokens.refresh_token);
    } else {
      console.log('No refresh_token returned. Remove the app at');
      console.log('https://myaccount.google.com/permissions and run again.');
    }
    console.log('==============================================\n');
    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500).end('Error: ' + err.message);
    console.error('Token exchange failed:', err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('\n1) Open this URL in your browser and approve:\n');
  console.log(authUrl);
  console.log(`\n2) Waiting for the redirect on ${REDIRECT_URI} ...\n`);
});
