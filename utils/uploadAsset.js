/**
 * Local (Hostinger) file storage. Multer has already written the uploaded file
 * to the `uploads/` directory (see middleware/uploadMiddleware.js); we simply
 * build the public URL that serves it via the static `/uploads` route.
 *
 * The `folder` argument is accepted for backwards compatibility with existing
 * callers but is not used for local storage — all files live under /uploads.
 */
const buildLocalUrl = (req, file) =>
  `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

/**
 * Return the public URL for a single multer file (from req.file or
 * req.files['fieldname'][i]). The file is kept on disk so it can be served.
 */
export const uploadFile = async (req, file /* , folder */) => {
  if (!file) return null;
  return buildLocalUrl(req, file);
};

/**
 * Backwards-compatible helper that returns the URL for `req.file`.
 * Preserved so existing callers (mediaController.uploadMediaAsset) keep working.
 */
export const uploadAsset = (req /* , folder */) => uploadFile(req, req.file);
