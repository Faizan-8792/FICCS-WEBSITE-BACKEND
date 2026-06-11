import { getMembership, getUser } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { uploadFile } from '../utils/uploadAsset.js';
import { buildMembershipPdf } from '../utils/membershipPdf.js';
import { exportMembershipToDrive } from '../utils/driveExport.js';

const REQUIRED_SCALARS = [
  'name',
  'email',
  'mobile',
  'dob',
  'gender',
  'isTrainee',
  'presentAffiliation',
  'presentState',
  'correspondingAddress',
  'permanentAddress',
  'mdDnbSubject',
  'dmJoiningYear',
  'dmCompletedYear',
];

const REQUIRED_SINGLE_FILES = ['profilePicture', 'mciCertificate'];
const REQUIRED_MULTI_FILES = ['degreeCertificates'];

const parseDegrees = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String).map((s) => s.trim()).filter(Boolean);
        }
      } catch {
        // fall through to comma-split
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

/**
 * Applicant status is surfaced via GET /memberships/mine (the progress tracker
 * on the My Membership page), which is per-user and always accurate. We avoid
 * broadcast Messages here because the Message model is audience:'all' and would
 * spam every member with one applicant's personal update.
 */

export const submitMembership = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const body = req.body || {};
  const files = req.files || {};

  const missing = REQUIRED_SCALARS.filter((field) => !String(body[field] || '').trim());
  if (missing.length) {
    res.status(400);
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  const degrees = parseDegrees(body.degrees);
  if (degrees.length === 0) {
    res.status(400);
    throw new Error('Please select at least one degree.');
  }

  for (const field of REQUIRED_SINGLE_FILES) {
    if (!files[field] || !files[field][0]) {
      res.status(400);
      throw new Error(`Missing required upload: ${field}`);
    }
  }
  for (const field of REQUIRED_MULTI_FILES) {
    if (!files[field] || files[field].length === 0) {
      res.status(400);
      throw new Error(`Missing required uploads: ${field}`);
    }
  }

  const uploadAll = (multerFiles, folder) =>
    Promise.all((multerFiles || []).map((f) => uploadFile(req, f, folder)));

  // Archive to Google Drive BEFORE the Cloudinary step (which deletes the temp
  // files). Generates a PDF of the submitted form and uploads it plus every
  // document into a per-applicant folder. Best-effort: a Drive failure must
  // never block the application from being saved.
  let driveFolderUrl = '';
  try {
    const pdfBuffer = await buildMembershipPdf({ ...body, degrees });
    const driveFiles = [];
    const collect = (arr, label) =>
      (arr || []).forEach((f, i) =>
        driveFiles.push({
          path: f.path,
          mimetype: f.mimetype,
          driveName: `${label}${arr.length > 1 ? `-${i + 1}` : ''}-${f.originalname}`,
        })
      );
    collect(files.profilePicture, 'ProfilePicture');
    collect(files.mciCertificate, 'MCI-Certificate');
    collect(files.govtId, 'Govt-ID');
    collect(files.degreeCertificates, 'Degree-Certificate');

    driveFolderUrl =
      (await exportMembershipToDrive({
        applicantName: body.name,
        pdfBuffer,
        files: driveFiles,
      })) || '';
  } catch (driveError) {
    console.error('[drive] membership export failed:', driveError.message);
  }

  const [profilePictureUrl] = await uploadAll(files.profilePicture, 'ficcs-membership/profile');
  const [mciCertificateUrl] = await uploadAll(files.mciCertificate, 'ficcs-membership/mci');
  const govtIdUrls = await uploadAll(files.govtId, 'ficcs-membership/govt-id');
  const degreeCertificateUrls = await uploadAll(
    files.degreeCertificates,
    'ficcs-membership/degree'
  );

  const membership = await Membership.create({
    name: body.name.trim(),
    email: String(body.email).trim(),
    mobile: String(body.mobile).trim(),
    dob: body.dob,
    gender: body.gender,
    isTrainee: body.isTrainee,
    presentAffiliation: body.presentAffiliation,
    presentState: body.presentState,
    correspondingAddress: body.correspondingAddress,
    permanentAddress: body.permanentAddress,
    degrees,
    mdDnbSubject: body.mdDnbSubject,
    dmJoiningYear: body.dmJoiningYear,
    dmCompletedYear: body.dmCompletedYear,
    profilePictureUrl,
    mciCertificateUrl,
    govtIdUrls,
    degreeCertificateUrls,
    driveFolderUrl,
    // Link to the logged-in applicant when available (route is protected).
    userId: req.user?.id || null,
    status: 'new',
    documentStatus: 'pending',
    paymentStatus: 'pending',
  });

  res.status(201).json({
    id: membership.id,
    status: membership.status,
    documentStatus: membership.documentStatus,
    paymentStatus: membership.paymentStatus,
    message:
      'Application received. The FICCS team will review your documents and reach out shortly.',
  });
});

export const getMemberships = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const memberships = await Membership.findAll({ order: [['createdAt', 'DESC']] });
  res.json(memberships);
});

/**
 * Applicant-facing: returns the logged-in user's latest membership application
 * with its document/payment stage so the UI can render the progress tracker.
 */
export const getMyMembership = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const membership = await Membership.findOne({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });

  if (!membership) {
    return res.json({ exists: false });
  }

  res.json({ exists: true, ...membership.toJSON() });
});

// Promote the linked user account to an approved member once BOTH stages pass.
const maybePromoteUser = async (membership) => {
  if (
    membership.documentStatus === 'approved' &&
    membership.paymentStatus === 'approved' &&
    membership.userId
  ) {
    const User = getUser();
    const user = await User.findByPk(membership.userId);
    if (user && user.role === 'user' && user.status !== 'approved') {
      user.status = 'approved';
      user.approvedAt = new Date();
      await user.save();
    }
    membership.status = 'approved';
    await membership.save();
  }
};

export const approveMembershipDocuments = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const { decision } = req.body; // 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(decision)) {
    res.status(400);
    throw new Error('decision must be "approved" or "rejected"');
  }

  const membership = await Membership.findByPk(req.params.id);
  if (!membership) {
    res.status(404);
    throw new Error('Membership application not found');
  }

  membership.documentStatus = decision;
  membership.status = decision === 'approved' ? 'reviewing' : 'rejected';
  await membership.save();

  await maybePromoteUser(membership);
  res.json(membership);
});

export const approveMembershipPayment = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const membership = await Membership.findByPk(req.params.id);
  if (!membership) {
    res.status(404);
    throw new Error('Membership application not found');
  }

  if (membership.documentStatus !== 'approved') {
    res.status(400);
    throw new Error('Approve the documents before confirming payment.');
  }

  membership.paymentStatus = 'approved';
  await membership.save();
  await maybePromoteUser(membership);

  res.json(membership);
});

export const updateMembershipStatus = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const { status } = req.body;
  const allowed = ['new', 'reviewing', 'approved', 'rejected'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const membership = await Membership.findByPk(req.params.id);

  if (!membership) {
    res.status(404);
    throw new Error('Membership application not found');
  }

  await membership.update({ status });
  res.json(membership);
});

/**
 * Permanently delete a single membership application. This removes the record
 * entirely (not a status change) — used by the admin to purge an entry from
 * every listing. Irreversible.
 */
export const deleteMembership = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const membership = await Membership.findByPk(req.params.id);

  if (!membership) {
    res.status(404);
    throw new Error('Membership application not found');
  }

  await membership.destroy();
  res.json({ id: Number(req.params.id), deleted: true });
});

/**
 * Permanently delete ALL membership applications. Irreversible bulk purge —
 * admin-only. Returns the number of rows removed.
 */
export const deleteAllMemberships = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const deleted = await Membership.destroy({ where: {}, truncate: false });
  res.json({ deleted });
});
