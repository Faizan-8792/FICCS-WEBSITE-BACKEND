// Source-of-truth defaults for FICCS public content.
//
// All factual content in this file comes from the official FICCS program
// brochures stored in /DOCUMENT (FICCS Leaflet, FICCS-SUCCEX-T poster,
// FICCS SUCCEX-2024 brochure, SUCCEX-T grid). Both flagship programs are
// currently archived (completed); registrations are no longer open. New
// inquiries go through the official FICCS WhatsApp inquiry line.
//
// FICCS = Forum of Intensivists and Critical Care Specialists.
// Inquiry WhatsApp / Phone: +91 98748 92629
//
// IMPORTANT: keep this file ASCII-only. Earlier round-trips through some
// Windows editors corrupted smart quotes / em-dashes into mojibake.

export const FICCS_INQUIRY_NUMBER = '+919874892629';
export const FICCS_INQUIRY_DISPLAY = '+91 98748 92629';
export const FICCS_INQUIRY_EMAIL = 'Theficcs.india@gmail.com';

const inquiryTemplate =
  'Hello FICCS Team, I am interested in "{title}" ({category}). Please share more details and the next steps.';

export const defaultHomeContent = {
  heroTitle: 'Forum of Intensivists and Critical Care Specialists',
  heroSubtitle:
    'A registered professional body of doctors with NMC-recognized super-specialty training in Critical Care Medicine, working to strengthen intensivist-led ICU practice across India.',
  heroCta1Link: '/about',
  heroCta2Link: '/membership',
  heroVideoUrl:
    'https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_24fps.mp4',
  aboutPreviewText:
    'FICCS includes doctors who have completed NMC-recognized DM, DrNB, and FNB super-specialty training in Critical Care Medicine. Together we run structured exam-prep programs, mentor early-career intensivists, and advocate for closed, intensivist-led ICUs.',
  aboutPreviewSection: {
    eyebrow: 'About FICCS',
    title:
      'A national forum dedicated to safer, intensivist-led critical care.',
    ctaText: 'Know More',
    ctaUrl: '/about',
  },
  aboutPreviewStats: {
    programLabel: 'Flagship Programs',
    programTitle: 'EXAMBUDDY and FICCS SUCCEX-T',
    programCopy:
      'EXAMBUDDY for DM/DrNB practical exam preparation and FICCS SUCCEX-T for DM/DrNB theory exam preparation, delivered by senior intensivists, examiners, and previous batch toppers.',
    stat1Value: '25+',
    stat1Label: 'eminent faculty across SUCCEX-T',
    stat2Value: '48+',
    stat2Label: 'experienced mentors',
  },
  aimTitle:
    'Every critically ill patient deserves intensivist-led ICU care.',
  aimDescription:
    'Critical care specialists are experts in life-threatening illness, ventilation, shock, sepsis, and multi-organ failure. FICCS advocates that these patients must be managed by formally trained intensivists holding recognized super-specialty qualifications.',
  aimImage: '',
  // Founders are intentionally empty. The public-facing leadership is rendered
  // by the Executive Committee section on the About page.
  founders: [],
  recentActivities: [
    {
      title: 'EXAMBUDDY - DM/DrNB Practical Exam Preparation',
      description:
        'Three-day simulated practical exam (16-18 January 2026) with 9 cases, 8 sets of table viva, and live debriefing led by senior examiners. Program completed.',
      date: new Date('2026-01-18T14:30:00.000Z').toISOString(),
    },
    {
      title: 'FICCS SUCCEX-T - DM/DrNB Theory Exam Preparation',
      description:
        'Two batches across November 2024 delivered 24 hours of consolidated theory prep over 12 critical-care domains, with 25+ faculty and 48+ mentors. Program completed.',
      date: new Date('2024-11-21T14:30:00.000Z').toISOString(),
    },
    {
      title: '12-Domain SUCCEX-T Curriculum Released',
      description:
        'Full curriculum grid covering Cardiac, Respiratory, Nephrology, GHIPB, Post-Surgical, Oncology, Infectious Disease, Endocrine, Statistics, Neuro/EOLC, Resuscitation, and Emergency Care.',
      date: new Date('2024-10-20T00:00:00.000Z').toISOString(),
    },
  ],
  socialLinks: {
    linkedin: '',
    instagram: '',
    x: '',
  },
  eventsSection: {
    eyebrow: 'Programs',
    title: 'Structured exam preparation programs by FICCS.',
    copy: 'Two flagship programs from the FICCS academic series. For inquiries about future editions, reach out via WhatsApp.',
  },
  featuredSection: {
    heading: 'Our Aim',
    eyebrow: 'FICCS Vision',
    linkText: 'About FICCS',
    linkUrl: '/about',
    ctaText: 'Explore Our Mission',
    ctaUrl: '/about',
  },
  latestProgramsSection: {
    heading: 'Recent Program Updates',
    linkText: 'View all programs',
    linkUrl: '/activities',
  },
  impactStats: {
    eyebrow: 'Program Impact',
    heading: 'Built and Backed by Practising Intensivists',
    description:
      'Our flagship programs draw on a network of senior critical care faculty, examiners, and previous batch toppers from across India.',
    items: [
      {
        icon: 'Users',
        value: 25,
        suffix: '+',
        label: 'Eminent Faculty',
        description: 'Senior intensivists across SUCCEX-T and EXAMBUDDY',
      },
      {
        icon: 'Stethoscope',
        value: 48,
        suffix: '+',
        label: 'Experienced Mentors',
        description: 'Domain experts, examiners, and previous toppers',
      },
      {
        icon: 'BookOpen',
        value: 12,
        suffix: '',
        label: 'Critical Care Domains',
        description: 'Covered across the SUCCEX-T theory curriculum',
      },
      {
        icon: 'Award',
        value: 200,
        suffix: '+',
        label: 'Success Stories',
        description: 'Aspirants supported through structured exam prep',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Testimonials',
    heading: 'Voices from the FICCS community',
    description:
      'Real feedback from intensivists and exam aspirants will be added as the program collects attributed reviews.',
    items: [],
  },
  focusAreas: [
    {
      label: 'Exam Preparation',
      icon: 'BookOpen',
      slug: 'exam-prep',
      desc: 'EXAMBUDDY (practical) and SUCCEX-T (theory) programs',
    },
    {
      label: 'ICU Leadership',
      icon: 'Users',
      slug: 'icu-leadership',
      desc: 'Closed, intensivist-led ICU systems',
    },
    {
      label: 'Super-Specialty Training',
      icon: 'Stethoscope',
      slug: 'training',
      desc: 'DM, DrNB, and FNB-aligned learning pathways',
    },
    {
      label: 'Mentorship',
      icon: 'HeartPulse',
      slug: 'mentorship',
      desc: 'Senior examiners and previous toppers as mentors',
    },
    {
      label: 'Ethical Practice',
      icon: 'ShieldCheck',
      slug: 'ethics',
      desc: 'Opposing non-recognized shortcut programs',
    },
    {
      label: 'Professional Collaboration',
      icon: 'Globe',
      slug: 'collaboration',
      desc: 'National and cross-institutional partnerships',
    },
  ],
  focusAreasSection: {
    heading: 'Core Focus Areas',
  },
  recentUpdatesSection: {
    heading: 'Recent Updates',
  },
  missionBanner: {
    eyebrow: 'Our Mission',
    heading: 'Empowering Critical Care Medicine as a true super-specialty.',
    description:
      'FICCS stands for excellence, responsibility, and patient safety. We work to ensure that every ICU is led by qualified intensivists and every critically ill patient receives expert care.',
    cta1Text: 'Learn More About FICCS',
    cta1Link: '/about',
    cta2Text: 'Apply for Membership',
    cta2Link: '/membership',
  },
  activitiesPageHero: {
    eyebrow: 'Programs',
    title: 'Structured academic programs for critical care professionals.',
    copy: 'Explore the SUCCEX-T domain curriculum and the EXAMBUDDY practical track.',
  },
  activitiesSection: {
    eyebrow: 'Programs',
    title: 'Browse academic programs and curriculum domains.',
    copy: 'Domain-based theory preparation and case-driven practical sessions for DM, DrNB, and FNB Critical Care aspirants.',
  },
  mediaPageHero: {
    eyebrow: 'Media',
    title: 'Photos and videos from FICCS programs.',
    copy: 'A growing library of moments from FICCS academic activities.',
  },
  photoGallerySection: {
    eyebrow: 'Photo Gallery',
    title: 'Snapshots from FICCS programs.',
  },
  videoGallerySection: {
    eyebrow: 'Video Gallery',
    title: 'Talks, recaps, and educational sessions.',
  },
  contactPageHero: {
    eyebrow: 'Contact',
    title: 'Connect with FICCS',
    copy: 'Reach us for program inquiries, membership, academic collaboration, and ICU mentorship.',
  },
};

// `companyDescription` is the short, hero-friendly summary used in the About
// page hero. `companyOverview` keeps the canonical long-form FICCS statement
// for any future long-copy slot. ASCII only.
const ficcsShortDescription =
  'FICCS is a registered professional body of doctors with NMC-recognized super-specialty training (DM, DrNB, FNB) in Critical Care Medicine. We strengthen ICU practice across India through structured education, mentorship, ethical advocacy, and intensivist-led leadership.';

const ficcsLongOverview =
  'The Forum of Intensivists and Critical Care Specialists (FICCS) is a registered professional body of doctors dedicated to strengthening Critical Care Medicine as an independent and highly important super-specialty. It includes doctors who have completed National Medical Commission (NMC)-recognized super-specialty training such as DM, DrNB, and FNB in Critical Care Medicine. These qualifications represent advanced and structured training in managing seriously ill patients in Intensive Care Units (ICUs). In today\'s healthcare system, Critical Care Medicine has become one of the most essential parts of patient care. With increasing numbers of patients suffering from severe infections, organ failure, trauma, heart attacks, strokes, transplants, poisoning, and post-surgical complications, the need for trained intensivists is greater than ever. Critical care specialists are experts in handling life-threatening conditions, advanced ventilator management, shock, sepsis, multi-organ failure, and emergency decision-making. An intensivist is not only a treating doctor but also the leader of the ICU team. They coordinate with all specialties such as medicine, surgery, cardiology, neurology, nephrology, pulmonology, anesthesia, and emergency medicine to provide the best outcome for critically ill patients. Since ICU care requires continuous monitoring and quick decisions, it is important that ICUs are led by qualified Critical Care specialists who understand the complete picture of patient management. FICCS believes that Critical Care Medicine should be empowered and given its rightful place in healthcare leadership. Closed ICUs led by trained intensivists have shown better patient outcomes, reduced mortality, shorter ICU stay, improved infection control, and more efficient use of hospital resources. When intensivists are given leadership roles, patient care becomes safer, faster, and more organized. The main vision of FICCS is to improve the standard of critical care across the country by promoting quality education, research, ethical practice, and better ICU systems. It also works to support intensivists, create awareness about the importance of formal super-specialty training, and ensure that critically ill patients are treated only by properly trained specialists. FICCS strongly opposes short-term, non-recognized courses that claim to create intensivists without proper training. Managing critically ill patients requires years of dedicated education, practical experience, and scientific knowledge. Incomplete training can risk patient safety and weaken the standards of the specialty. The Forum also encourages teamwork, mentorship, academic growth, and collaboration with national and international organizations so that Indian Critical Care Medicine can match global standards. FICCS stands for excellence, responsibility, and patient safety. Its vision is clear - to ensure that every ICU is led by qualified intensivists and every critically ill patient receives the best possible care from trained Critical Care specialists.';

export const defaultAboutContent = {
  companyDescription: ficcsShortDescription,
  companyOverview: ficcsLongOverview,
  mission:
    'To improve the standard of critical care across India by promoting quality education, research, ethical practice, and better ICU systems - ensuring every ICU is led by qualified intensivists.',
  founderNote:
    'Every ICU should be led by qualified intensivists, and every critically ill patient should receive specialist care.',
  contactEmail: FICCS_INQUIRY_EMAIL,
  contactPhone: FICCS_INQUIRY_DISPLAY,
  contactAddress: 'India',
  founders: [],
  timeline: [
    {
      year: '2024',
      title: 'FICCS SUCCEX-T Theory Exam Prep - Two Batches Delivered',
      description:
        'Six-day, 24-hour, domain-based theory preparation program for DM/DrNB Critical Care aspirants delivered in November 2024 with 25+ faculty and 48+ mentors across two batches.',
    },
    {
      year: '2024',
      title: '12-Domain SUCCEX-T Curriculum Grid Published',
      description:
        'Complete curriculum grid published covering Cardiac, Respiratory, Nephrology, GHIPB, Post-Surgical, Oncology, Infectious Disease, Endocrine, Statistics, Neuro/EOLC, Resuscitation, and Emergency Care.',
    },
    {
      year: '2026',
      title: 'EXAMBUDDY Practical Exam Prep - Concluded',
      description:
        'Three-day simulated practical examination program (Jan 16-18, 2026) for DM/DrNB practical examinees with 9 cases, 8 sets of table viva, and live debriefing by senior examiners.',
    },
  ],
  whoWeAre: {
    eyebrow: 'Who We Are',
    heading: 'Forum of Intensivists and Critical Care Specialists',
    description:
      'The Forum of Indian Critical Care Specialists (FICCS) is a professional body representing Intensivists who possess National Medical Commission (NMC)-recognized super-specialty qualifications in Critical Care Medicine, namely DM, DrNB, or FNB. FICCS is dedicated to advancing the standards of critical care practice, education, research, and patient safety across India through evidence-based medicine, ethical clinical practice, and the promotion of formally trained critical care specialists. The forum serves as a collective voice for qualified Intensivists and works towards strengthening critical care services, fostering academic excellence, and advocating for high-quality, standardized intensive care delivery for all critically ill patients.',
  },
  whyItMatters: {
    eyebrow: 'Why It Matters',
    heading: 'Critical Care Is an Essential Pillar of Modern Healthcare',
    description1:
      'With increasing numbers of patients suffering from severe infections, organ failure, trauma, heart attacks, strokes, transplants, poisoning, and post-surgical complications, the need for trained intensivists is greater than ever.',
    description2:
      'Critical care specialists are experts in handling life-threatening conditions, advanced ventilator management, shock, sepsis, multi-organ failure, and emergency decision-making.',
    items: [
      { icon: 'HeartPulse', label: 'Ventilator and organ support expertise' },
      { icon: 'Brain', label: 'Shock, sepsis, and emergency decision-making' },
      { icon: 'ShieldCheck', label: 'Continuous high-risk monitoring' },
      { icon: 'Stethoscope', label: 'Evidence-based critical interventions' },
    ],
  },
  intensivistRole: {
    eyebrow: 'Leadership',
    heading: 'The Intensivist Leads the ICU Team',
    description:
      'An intensivist is not only a treating doctor but also the leader of the ICU team. They coordinate with all specialties - medicine, surgery, cardiology, neurology, nephrology, pulmonology, anaesthesia, and emergency medicine - to deliver the best outcomes for critically ill patients.',
    cards: [
      {
        icon: 'Users',
        title: 'Team Coordination',
        copy: 'ICU care demands continuous monitoring and rapid decisions. Intensivist-led leadership keeps multidisciplinary teams synchronized so the patient always sees one coherent plan.',
      },
      {
        icon: 'Award',
        title: 'Better Outcomes',
        copy: 'Closed ICUs led by trained intensivists have shown better patient outcomes, reduced mortality, shorter ICU stay, improved infection control, and more efficient use of hospital resources.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Safer Systems',
        copy: 'When intensivists are given leadership roles, patient care becomes safer, faster, and more organized - backed by qualified specialists who see the complete picture of ICU management.',
      },
    ],
  },
  visionMission: {
    eyebrow: 'Vision',
    heading: 'Elevating ICU Standards Nationwide',
    description:
      'FICCS works to improve the standard of critical care across India by promoting quality education, research, ethical practice, and better ICU systems. It also creates awareness that critically ill patients must be treated only by properly trained specialists.',
    items: [
      { icon: 'BookOpen', label: 'Quality Education' },
      { icon: 'Brain', label: 'Research and Innovation' },
      { icon: 'ShieldCheck', label: 'Ethical Practice' },
      { icon: 'HeartPulse', label: 'Better ICU Systems' },
    ],
  },
  standardsEthics: {
    eyebrow: 'Standards',
    heading: 'Defending Specialty Integrity and Patient Safety',
    description1:
      'FICCS strongly opposes short-term, non-recognized courses that claim to create intensivists without proper training.',
    description2:
      'Managing critically ill patients requires years of dedicated education, practical experience, and scientific knowledge. Incomplete training can risk patient safety and weaken the standards of the specialty.',
    blockquote:
      'Managing critically ill patients requires years of dedicated education, practical experience, and scientific knowledge.',
    blockquoteFooter: 'FICCS ethical position',
  },
  collaboration: {
    eyebrow: 'Collaboration',
    heading: 'Working Toward Global-Level Critical Care Standards',
    description:
      'FICCS encourages teamwork, mentorship, academic growth, and collaboration with national and international organizations so that Indian Critical Care Medicine can match global standards.',
    items: [
      { icon: 'Globe', label: 'International collaboration' },
      { icon: 'Users', label: 'Mentorship ecosystems' },
      { icon: 'BookOpen', label: 'Academic growth' },
      { icon: 'Award', label: 'Quality benchmarking' },
    ],
  },
  commitment: {
    heading: 'Our Commitment',
    description1:
      'FICCS stands for excellence, responsibility, and patient safety. We advocate that every ICU should be led by qualified intensivists.',
    description2:
      'Our long-term vision is clear - every critically ill patient receives the best possible care from trained Critical Care specialists.',
  },
  timelineSection: {
    eyebrow: 'Timeline',
    title: 'Key milestones in the FICCS journey',
  },
  foundersSection: {
    eyebrow: '',
    title: '',
    copy: '',
  },
};

export const defaultContactPageContent = {
  headline: 'Contact FICCS',
  introText:
    'Reach out for program inquiries, academic collaboration, ICU mentorship, or membership support.',
  contactSectionHeading: 'Start a conversation with us',
  contactSectionCopy:
    'Whether your query is about EXAMBUDDY, SUCCEX-T, membership, or academic collaboration, the FICCS team will respond. The fastest way to reach us is via WhatsApp.',
  officeEmail: FICCS_INQUIRY_EMAIL,
  officePhone: FICCS_INQUIRY_DISPLAY,
  officeAddress: 'India',
  mapEmbedUrl: 'https://www.google.com/maps?q=India&z=5&output=embed',
};

// Real FICCS programs documented in the official brochures. Both programs
// are archived/completed. New inquiries route through the FICCS WhatsApp
// inquiry line - `membersOnlyContact: true` ensures only approved members
// see the inquiry CTA on the public detail page; everyone else sees the
// program details and can reach out via the centralized contact page.
//
// Images are intentionally empty - the admin uploads program photos via
// the CMS / Cloudinary pipeline.
export const defaultEvents = [
  {
    title: 'EXAMBUDDY - DM/DrNB Practical Exam Preparation (Concluded)',
    description:
      'Three-day simulated practical exam (16-18 January 2026) with real cases, 8 sets of table viva, and live debriefing by senior examiners. Exclusive program for DM/DrNB Critical Care practical examinees. This edition is concluded.',
    body:
      'EXAMBUDDY was a focused practical-exam preparation program by FICCS, structured to mirror the real DM/DrNB Critical Care practical examination experience. This edition has been delivered and is now archived; preserve the program structure below as a reference for future cohorts and to give context to inquiries.\n\nProgram structure:\n- Part A: 16th, 17th, 18th January 2026 (6-9 PM) - total 9 cases and 8 sets of Table Viva, mock-exam feel with immediate debriefing, assessment by real-time examination.\n- Part B: Doubt-clearing session and post-exam debriefing.\n\nDay-wise topics:\n- Day 1 (16 Jan 2026): Long Case - ARDS (Dr Saurabh Taneja); Short Case - Febrile Neutropenia and CAP (Dr Subhankar Paul); Table Viva (Dr Kuldeep Singh, Dr Rishabh Mittal, Dr Sunil Kumar Kedia, Dr Mohammed Khalid).\n- Day 2 (17 Jan 2026): Long Case - Stroke (Dr Sunil Karanth); Short Case - UGI Bleed and Dengue (Dr Shantanu Ghosh); Table Viva (Dr Prithviraj Saha).\n- Day 3 (18 Jan 2026): Long Case - Trauma; Short Case - OP Poisoning and Pre-Eclampsia with HELLP; Table Viva.\n\nChief Mentors: Dr Sunil Karanth (Chairman, Critical Care Services, Manipal Hospitals) and Dr Saurabh Taneja (Consultant Critical Care, Sir Gangaram Hospital, Delhi).\n\nFor inquiries about future editions, please reach out to the FICCS team via WhatsApp.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    date: new Date('2026-01-18T14:30:00.000Z').toISOString(),
    location: 'Online - concluded',
    registerUrl: '',
    registerLabel: 'Inquire on WhatsApp',
    membersOnlyContact: true,
    contactWhatsappNumber: FICCS_INQUIRY_NUMBER,
    contactMessageTemplate: inquiryTemplate,
  },
  {
    title: 'FICCS SUCCEX-T - DM/DrNB Theory Exam Preparation (Concluded)',
    description:
      'Six-day, 24-hour online theory program covering 12 critical-care domains, delivered by 25+ eminent faculty and 48+ experienced mentors across two November 2024 batches. This edition is concluded.',
    body:
      'FICCS SUCCEX-T was a tailor-made, domain-based approach to the theory part of DM / DrNB Critical Care examinations. This edition has been delivered and is now archived; the structure is preserved here for reference and so future aspirants can understand what the program looks like.\n\nProgram at a glance:\n- 6 days, 4 hours per day = 24 hours of consolidated study\n- 12 critical-care domains\n- 120+ questions and discussion\n- 25+ eminent faculty\n- 48+ experienced mentors\n\nBatches (November 2024):\n- Batch 1: 12th, 13th, 14th November 2024\n- Batch 2: 19th, 20th, 21st November 2024\n\nWho attended:\n- DM/DrNB Post Doc trainees\n- Critical Care residents\n- Exam aspirants\n\nTraining structure included previous-year question discussion, formatted answers, hot topics, flow diagrams, tips and tricks, and structured enumeration.\n\nLeadership:\n- Course Moderator: Dr Arindam Kar\n- Course Directors: Dr Subhankar Paul, Dr Kulsaurabh Kaushik\n- Course Co-Directors: Dr Sunil Kr Kedia, Dr Mayur Jadav, Dr Mohammed Khalid\n\nFor inquiries about future SUCCEX-T editions, please reach out to the FICCS team via WhatsApp.',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    date: new Date('2024-11-21T14:30:00.000Z').toISOString(),
    location: 'Online - concluded',
    registerUrl: '',
    registerLabel: 'Inquire on WhatsApp',
    membersOnlyContact: true,
    contactWhatsappNumber: FICCS_INQUIRY_NUMBER,
    contactMessageTemplate: inquiryTemplate,
  },
];

// The 12 SUCCEX-T critical-care domains. Content from the SUCCEX-T grid
// brochure. Images intentionally empty - admin uploads when ready.
const buildDomainActivity = ({ title, content, body, highlights, image }) => ({
  type: 'academic',
  title,
  content,
  body,
  image: image || '',
  date: null,
  location: '',
  highlights,
  registerUrl: '',
  registerLabel: 'Inquire on WhatsApp',
  membersOnlyContact: true,
  contactWhatsappNumber: FICCS_INQUIRY_NUMBER,
  contactMessageTemplate: inquiryTemplate,
});

export const defaultActivities = [
  buildDomainActivity({
    title: 'Cardiac Sciences',
    image: 'https://images.unsplash.com/photo-1628348068343-eb9c7bae76b0?auto=format&fit=crop&w=1200&q=80',
    content:
      'Devices, mechanical circulatory support, transplant, and ECMO. Cardiogenic shock, IABP, VA-ECMO indications, cardiac biomarkers, STEMI management, arrhythmias, vasopressors, and venous thromboembolism.',
    body:
      'The Cardiac Sciences domain covers high-stakes ICU cardiology including cardiogenic shock with mechanical circulatory support, VA-ECMO indications and the Harlequin phenomenon, ECPR, right heart failure and diastolic dysfunction, atrial fibrillation and ventricular tachycardias, double sequential defibrillation, cardiac biomarkers, STEMI diagnosis and management, acute decompensated heart failure, vasopressors and inotropes including angiotensin-2, venous thromboembolism, and pulmonary embolism. Faculty includes Dr Rahul Pandit, Dr Sandeep Dewan, Dr Arpan Chakraborty, and Dr Dhruva Chaudhary.',
    highlights: ['Cardiogenic shock and MCS', 'VA-ECMO and ECPR', 'STEMI and arrhythmias'],
  }),
  buildDomainActivity({
    title: 'Respiratory Sciences',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80',
    content:
      'Ventilation and ECMO. Driving pressure, transpulmonary pressure, auto-PEEP, ECCO2R, ARDS critical appraisal, proning, optimal PEEP, APRV, HFNO, V-V ECMO evidence, scalars and loops.',
    body:
      'The Respiratory Sciences module addresses driving pressure and transpulmonary pressure, auto-PEEP and ECCO2R, ultrasound assessment of diaphragmatic function, difficult weaning, ARDS definition and proning, restrictive vs liberal oxygen therapy, optimal PEEP, APRV and adaptive support ventilation, reverse triggering, HFNO current status, air transport of ARDS patients to ECMO centres, clinical utility of scalars and loops, and V-V ECMO evidence in ARDS. Faculty includes Dr Sameer Jog, Dr Ram Rajagopalan, Dr Suresh Ramasubban, and Dr Vinod Singh.',
    highlights: ['Protective ventilation', 'ARDS and proning', 'V-V ECMO evidence'],
  }),
  buildDomainActivity({
    title: 'Nephrology',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80',
    content:
      'RRT, fluids, transplantation, and electrolytes. AKI classification, GFR assessment, contrast-induced AKI, hepatorenal and cardiorenal syndromes, plasmapheresis, CRRT timing and dosing, biomarkers, and Stewart approach.',
    body:
      'The Nephrology module covers critical appraisal of AKI classification systems, GFR assessment, dialysis disequilibrium syndrome, contrast-induced AKI prevention, hepatorenal and cardiorenal syndromes, plasmapheresis and plasma exchange, post-renal-transplant rejection and infections, CRRT timing, dose, and anticoagulation, renal resistive index, AKI biomarkers, the Stewart approach, colloid vs crystalloid trials, metabolic alkalosis, and NAGMA. Faculty includes Dr Ranajit Chatterjee, Dr Saurabh Saigal, Dr Supradip Ghosh, Dr Arijit Sardar, and Dr Ramesh Venkatraman.',
    highlights: ['AKI staging', 'CRRT prescription', 'Acid-base balance'],
  }),
  buildDomainActivity({
    title: 'GHIPB',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80',
    content:
      'Gastroenterology, hepatology, and intervention. SBP, refractory ascites, massive GI bleed, TIPS, acute pancreatitis, mesenteric ischaemia, ALF and ACLF, post-liver-transplant care, gut microbiota, and selective digestive decontamination.',
    body:
      'The GHIPB domain addresses post-transplant fever and respiratory presentations, spontaneous bacterial peritonitis and refractory ascites, massive GI bleed management with the role of TIPS, acute pancreatitis nutrition and antibiotics, acute mesenteric ischaemia, acute and acute-on-chronic liver failure with hepatic encephalopathy, post-liver-transplant care with raised enzymes and coagulopathy, gut microbiota and selective digestive decontamination, acalculous cholecystitis, liver abscess management, and extracorporeal therapy in ALF and ACLF. Faculty includes Dr Sunil Karanth, Dr Deepak Govil, Dr Pradyut Bag, and Dr Vaishali Solao.',
    highlights: ['ALF and ACLF', 'GI bleed and TIPS', 'Post-transplant ICU'],
  }),
  buildDomainActivity({
    title: 'Post Surgical Care',
    image: 'https://images.unsplash.com/photo-1551190822-a9ce113d0d15?auto=format&fit=crop&w=1200&q=80',
    content:
      'Trauma care, peri-operative care, traumatic brain injury, and obstetric critical care. Liver dysfunction in pregnancy, HELLP, AFE, eclampsia, polytrauma assessment, severe TBI, ICP monitoring, damage control resuscitation, ERAS, and rhabdomyolysis.',
    body:
      'The Post Surgical Care module covers liver dysfunction in pregnancy, HELLP syndrome, cardio-respiratory arrest in pregnant women and CPR modifications, amniotic fluid embolism, eclampsia management, polytrauma assessment with the lethal triad and trimodal distribution of death, severe TBI in the ER, intracranial pressure monitoring, hypertonic saline and mannitol, decompression craniotomy, damage control and hypotensive resuscitation, blunt abdominal trauma, fluid therapy in burns, ERAS, abdominal compartment syndrome, rhabdomyolysis, and massive transfusion protocol. Faculty includes Dr Srinivas Samavedam, Dr Harsh Sapra, Dr Kapil Zirpe, Dr P L Gautam, Dr Sai Saran, and Dr Kapil Dev Soni.',
    highlights: ['Polytrauma and TBI', 'Obstetric emergencies', 'Damage control resuscitation'],
  }),
  buildDomainActivity({
    title: 'Oncology',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    content:
      'Clinical immunology, onco-surgical critical care, haematology and coagulation, and tissue disorders. TTP, HIT, DIC, tumour lysis syndrome, febrile neutropenia, refeeding syndrome, HLH, SVC syndrome, NOACs, cytokine storm, and GVHD.',
    body:
      'The Oncology domain covers acquired thrombotic thrombocytopenic purpura, heparin-induced thrombocytopenia diagnosis and management, disseminated intravascular coagulation, tumour lysis syndrome, febrile neutropenia evaluation and empirical antibiotic therapy, refeeding syndrome and short bowel syndrome, HLH and superior vena cava syndrome, NOACs and LMWH, chemotherapeutic agent complications, cytokine storm syndrome, GVHD, and infections associated with bone marrow transplantation. Faculty includes Dr Srinivas Samavedam, Dr Vatsal Kothari, Dr Sudipta Mukherjee, and Dr Jigi Divatia.',
    highlights: ['Coagulation emergencies', 'Febrile neutropenia', 'Cytokine storm'],
  }),
  buildDomainActivity({
    title: 'Infectious Disease',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
    content:
      'Sepsis, tropical disease, infection control, and epidemics. Severe CAP, ICU diarrhoea and Clostridium difficile, necrotising fasciitis, sepsis biomarkers, MDR pathogens, severe malaria, dengue shock, invasive fungal infections, and antimicrobial stewardship.',
    body:
      'The Infectious Disease module covers severe community-acquired pneumonia diagnosis, scoring, and management, ICU diarrhoea including Clostridium difficile, necrotising fasciitis and toxic shock syndrome, newer markers of sepsis including procalcitonin, treating MDR Acinetobacter baumannii, Pseudomonas, and CRE, severe malaria pathophysiology, syndromic approach to tropical fever, dengue shock syndrome, invasive aspergillosis and mucormycosis, ICU infection control with bundle care, antimicrobial stewardship principles, and Candida auris. Faculty includes Dr Vasant Nagvekar, Dr Rishabh K Mittal, Dr Ashit Hegde, Dr Binila Chacko, and Dr Prakash Shastri.',
    highlights: ['Sepsis and MDR pathogens', 'Tropical infections', 'AMS programs'],
  }),
  buildDomainActivity({
    title: 'Endocrine, Metabolic and Toxicology',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    content:
      'Endocrine and metabolic disorders, drugs, pharmacology, toxicology, and bioterrorism. Thyroid storm, myxoedema coma, DKA/HHS, CIRCI, sick euthyroid syndrome, OP poisoning, snake bite, hyponatraemia, ODS, CSW vs SIADH, and ICU drugs.',
    body:
      'This domain covers thyroid storm and myxoedema coma, DKA and HHS management, critical illness related corticosteroid insufficiency, sick euthyroid syndrome, toxidromes and general management of poisoning, organophosphate poisoning and pralidoxime evidence, neurotoxic snake bite, methaemoglobinaemia, extracorporeal therapies in poisoning, lipid emulsion in toxicology, hyponatraemia and osmotic demyelination syndrome, cerebral salt wasting versus SIADH, and ICU drugs including albumin, IVIG, hypertonic saline, mannitol, and vitamins. Faculty includes Dr Pradeep Rangappa, Dr Amarja A Havaldar, Dr Ashit Hegde, and Dr Abdul Ansari.',
    highlights: ['Endocrine emergencies', 'OP poisoning and antidotes', 'Sodium disorders'],
  }),
  buildDomainActivity({
    title: 'Statistics, Quality and Nutrition',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    content:
      'Statistics, scoring, nutrition, rehabilitation, quality, safety, and accreditation. ICU nutrition, parenteral nutrition, delirium, sedation, ICU scoring systems, clinical trial phases, GRADE methodology, ROC curves, NNT, and hazard ratios.',
    body:
      'This domain covers nutrition in critically ill patients, parenteral nutrition indications and complications, delirium assessment and prevention, sedation principles, ICU scoring systems and SOFA critique, phases of clinical trials, systematic review and meta-analysis with forest plots, odds ratio and relative risk, GRADE methodology and levels of evidence, ROC curve analysis, number needed to treat, hazard ratio, chi-square, ANOVA, and Kaplan-Meier survival analysis. Faculty includes Dr Sanjith Sasheedharan, Dr Dalim Kumar Baidya, Dr Bikash Ranjan Ray, and Dr Anirban Hom Choudhury.',
    highlights: ['ICU nutrition', 'Critical statistics', 'Quality and accreditation'],
  }),
  buildDomainActivity({
    title: 'Neurology, EOLC and Ethics',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    content:
      'Neurology, brain death, end-of-life care, and ethics. Acute stroke thrombolysis, status epilepticus, transcranial Doppler, ICU neuromyopathy, GBS respiratory failure, brain death and apnoea test, communication skills, post-intensive-care syndrome, and advance medical directives.',
    body:
      'The Neurology and Ethics domain covers thrombolysis and mechanical thrombectomy in acute stroke, refractory and super-refractory status epilepticus, inhaled sedation, transcranial Doppler and ONSD, critical care neuromyopathy, respiratory failure in GBS, triple-H therapy in SAH, principles of end-of-life care, apnoea test and care of the brain-dead organ donor, communication skills and breaking bad news, post-intensive-care syndrome and chronic critical illness, vulnerable populations in research, conflict resolution in the ICU, advance medical directives, withdrawal of life support, and ICU quality care indicators. Faculty includes Dr Harsh Sapra, Dr Kapil Zirpe, Dr Banambar Ray, Dr Darshana Rathod, Dr Shiva Kumar Iyer, and Dr R K Mani.',
    highlights: ['Stroke and status epilepticus', 'Brain death and EOLC', 'ICU communication'],
  }),
  buildDomainActivity({
    title: 'Resuscitation and Procedures',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    content:
      'Resuscitation, procedures, intubation, imaging, and diagnostics. Difficult airway, apnoeic oxygenation, percutaneous tracheostomy, high-quality CPR and post-ROSC care, intra- and inter-hospital transfer, intercostal drains, AV saturation gap, ROX index and HACOR score, and non-invasive cardiac output monitoring.',
    body:
      'This domain covers difficult airway and the physiologically difficult airway, apnoeic oxygenation and delayed sequence intubation, percutaneous tracheostomy with applied anatomy, methods, complications, and timing, high-quality CPR with post-ROSC syndrome and prognostication, intra- and inter-hospital transfer, intercostal drain insertion and chamber-based drainage system appraisal, arterio-venous saturation gap, veno-arterial PCO2 gap and gap-gap ratio, ROX index and HACOR score, targeted temperature management, end-points of resuscitation, microcirculation, non-invasive cardiac output monitoring, and the passive leg raise test. Faculty includes Dr Sulagna Bhattacharya, Dr Pradeep Bhatia, Dr Rajesh Pandey, and Dr Arif Pasha.',
    highlights: ['Difficult airway', 'Tracheostomy and ICDs', 'Post-ROSC care'],
  }),
  buildDomainActivity({
    title: 'Emergency Care and Recent Advances',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    content:
      'Emergency care, rapid diagnostics, and recent advances. Organ cross-talk in sepsis, BLUE/FALLS/RUSH protocols, tele critical care and AI in critical care, TEG and ROTEM, pharmacology in critical illness, glycocalyx and reverse Starling law, electrical impedance tomography, continuous glucose monitoring, therapeutic drug monitoring, and aerosolised antibiotics.',
    body:
      'The Recent Advances domain examines organ cross-talk in sepsis, BLUE/FALLS/RUSH ultrasound protocols, tele critical care and AI applications, TEG and ROTEM viscoelastic testing, pharmacology changes in critical illness, obesity-related ICU issues, the ROSE/SOSD concept, glycocalyx physiology and the reverse Starling law, evidence-based steroid use, electrical impedance tomography, continuous glucose monitoring in ICU, therapeutic drug monitoring, and aerosolised antibiotics. Faculty includes Dr Rahul Pandit, Dr Rajesh Shetty, Dr Srinivas Samavedam, Dr Mehul Shah, Dr Sauren Panja, and Dr Supradip Ghosh.',
    highlights: ['Point-of-care ultrasound', 'TEG and ROTEM', 'Tele-ICU and AI'],
  }),
];

// Media collection is intentionally empty in defaults. Real photos and videos
// from FICCS programs are uploaded by the admin via the CMS / Cloudinary.
export const defaultMedia = [];

export const defaultMembershipPageContent = {
  heroEyebrow: 'Membership',
  heroTitle: 'Join the national forum of formally trained intensivists.',
  heroCopy:
    'FICCS membership connects you to a peer network of NMC-recognized intensivists, mentorship, academic programs, and policy advocacy for Critical Care Medicine standards.',
  eligibilitySection: {
    eyebrow: 'Who Can Join',
    heading: 'Membership Eligibility',
    description:
      'Membership is intended for doctors with NMC-recognized super-specialty training in Critical Care Medicine and for professionals aligned with the mission of safer, intensivist-led ICU systems.',
    items: [
      { text: 'DM in Critical Care Medicine' },
      { text: 'DrNB in Critical Care Medicine' },
      { text: 'FNB in Critical Care Medicine' },
      { text: 'Equivalent NMC-recognized super-specialty qualification' },
    ],
  },
  benefitsSection: {
    eyebrow: 'Membership Benefits',
    heading: 'Why Critical Care Specialists Join FICCS',
    description:
      'Membership offers long-term professional value through education, collaboration, and responsible leadership in patient safety.',
    items: [
      {
        icon: 'Users',
        title: 'Professional Network',
        copy: 'Connect with formally trained intensivists, mentors, and hospital leaders from across India.',
      },
      {
        icon: 'BookOpen',
        title: 'Academic Access',
        copy: 'Priority access to EXAMBUDDY, SUCCEX-T, webinars, and structured teaching tracks.',
      },
      {
        icon: 'Globe',
        title: 'Mentorship',
        copy: 'Guidance from senior examiners, domain experts, and previous batch toppers.',
      },
      {
        icon: 'Award',
        title: 'Specialty Representation',
        copy: 'Contribute to a credible voice that protects standards and strengthens ICU leadership quality.',
      },
    ],
  },
  whyItMattersSection: {
    eyebrow: 'Why Membership Matters',
    heading: 'Strengthen the Voice of Critical Care Medicine',
    description1:
      'By joining FICCS, you become part of a collective effort to ensure every ICU is led by a trained intensivist and every critically ill patient receives specialist care.',
    description2:
      'Members help drive standards, support ethical practice, and advocate against unsafe shortcut pathways in critical care training.',
    ctaText: 'Learn more about our mission',
    ctaLink: '/about',
    stats: [
      { stat: '25+', label: 'Eminent Faculty' },
      { stat: '48+', label: 'Senior Mentors' },
      { stat: '12', label: 'Curriculum Domains' },
      { stat: '200+', label: 'Success Stories' },
    ],
  },
};
