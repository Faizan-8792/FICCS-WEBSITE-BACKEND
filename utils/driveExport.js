import fs from 'node:fs';
import { Readable } from 'node:stream';
import { getDriveClient } from '../config/googleDrive.js';

// Strip characters that are illegal/awkward in Drive names.
const sanitize = (name) =>
  String(name || '')
    .replace(/[\\/:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const createFolder = async (drive, name, parentId) => {
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id, webViewLink',
    supportsAllDrives: true,
  });
  return res.data;
};

const uploadStream = (drive, folderId, name, mimeType, body) =>
  drive.files.create({
    requestBody: { name, parents: [folderId] },
    media: { mimeType: mimeType || 'application/octet-stream', body },
    fields: 'id',
    supportsAllDrives: true,
  });

/**
 * Create a per-applicant folder under the configured parent and upload the
 * generated application PDF plus all submitted document files into it.
 *
 * Best-effort by contract: callers should wrap in try/catch and never block the
 * membership submission on Drive failures. Returns the folder's web link (or
 * null when Drive isn't configured).
 *
 * @param {object} params
 * @param {string} params.applicantName
 * @param {Buffer} params.pdfBuffer
 * @param {Array<{path:string,driveName:string,mimetype?:string}>} params.files
 * @returns {Promise<string|null>}
 */
export const exportMembershipToDrive = async ({ applicantName, pdfBuffer, files = [] }) => {
  const drive = getDriveClient();
  const parentId = process.env.GDRIVE_PARENT_FOLDER_ID;
  if (!drive || !parentId) return null;

  const safeName = sanitize(applicantName) || 'Applicant';
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/:/g, '-');
  const folder = await createFolder(drive, `${safeName} - ${stamp}`, parentId);

  // Application PDF
  if (pdfBuffer) {
    await uploadStream(
      drive,
      folder.id,
      `${safeName} - Application.pdf`,
      'application/pdf',
      Readable.from(pdfBuffer)
    );
  }

  // Submitted documents (read from the multer temp files on disk)
  for (const f of files) {
    if (!f?.path || !fs.existsSync(f.path)) continue;
    await uploadStream(drive, folder.id, f.driveName, f.mimetype, fs.createReadStream(f.path));
  }

  return folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`;
};
