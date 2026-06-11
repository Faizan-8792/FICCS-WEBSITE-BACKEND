import PDFDocument from 'pdfkit';

const FIELDS = [
  ['Full Name', 'name'],
  ['Email', 'email'],
  ['Mobile', 'mobile'],
  ['Date of Birth', 'dob'],
  ['Gender', 'gender'],
  ['Is Trainee', 'isTrainee'],
  ['Present Affiliation', 'presentAffiliation'],
  ['Present State', 'presentState'],
  ['Corresponding Address', 'correspondingAddress'],
  ['Permanent Address', 'permanentAddress'],
  ['Degrees', 'degrees'],
  ['MD/DNB Subject', 'mdDnbSubject'],
  ['DM Joining Year', 'dmJoiningYear'],
  ['DM Completed Year', 'dmCompletedYear'],
];

const valueOf = (data, key) => {
  const v = data[key];
  if (Array.isArray(v)) return v.join(', ');
  const s = String(v ?? '').trim();
  return s.length ? s : '-';
};

/**
 * Render the submitted membership form into a PDF and resolve with a Buffer.
 * Pure text layout — no external assets — so it works on any host.
 *
 * @param {object} data - the membership form fields (name, email, degrees ...).
 * @returns {Promise<Buffer>}
 */
export const buildMembershipPdf = (data) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).fillColor('#0f172a').text('FICCS Membership Application', { align: 'center' });
      doc.moveDown(0.3);
      doc
        .fontSize(10)
        .fillColor('#64748b')
        .text(`Generated ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(1);

      // Divider
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2e8f0').stroke();
      doc.moveDown(1);

      // Fields
      FIELDS.forEach(([label, key]) => {
        doc.fontSize(9).fillColor('#64748b').text(label.toUpperCase(), { characterSpacing: 0.5 });
        doc.moveDown(0.1);
        doc.fontSize(12).fillColor('#0f172a').text(valueOf(data, key));
        doc.moveDown(0.6);
      });

      if (String(data.details || '').trim()) {
        doc.moveDown(0.3);
        doc.fontSize(9).fillColor('#64748b').text('OTHER DETAILS');
        doc.moveDown(0.1);
        doc.fontSize(12).fillColor('#0f172a').text(String(data.details).trim());
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
