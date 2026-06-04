import { getMembership } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { uploadFile } from '../utils/uploadAsset.js';

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
    status: 'new',
  });

  res.status(201).json({
    id: membership.id,
    status: membership.status,
    message:
      'Application received. The FICCS team will review your details and reach out shortly.',
  });
});

export const getMemberships = asyncHandler(async (req, res) => {
  const Membership = getMembership();
  const memberships = await Membership.findAll({ order: [['createdAt', 'DESC']] });
  res.json(memberships);
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
