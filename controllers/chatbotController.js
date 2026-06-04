import { asyncHandler } from '../middleware/asyncHandler.js';
import { getAboutContent as getAboutContentModel, getEvent, getActivity, getMembershipPageContent as getMembershipPageContentModel, getContactPageContent as getContactPageContentModel } from '../models/index.js';

// ─── Intent patterns ──────────────────────────────────────────────────────────

const intents = [
  {
    id: 'greeting',
    patterns: [
      /^(hi|hello|hey|good\s?(morning|afternoon|evening)|namaste|howdy|sup)/i,
      /^(what'?s?\s*up|yo)/i,
    ],
  },
  {
    id: 'about',
    patterns: [
      /what\s+(is|are)\s+ficcs/i,
      /about\s+ficcs/i,
      /tell\s+me\s+about/i,
      /who\s+(is|are)\s+(ficcs|you)/i,
      /ficcs\s+(kya|kya\s+hai)/i,
      /organization/i,
      /forum\s+of\s+intensivists/i,
    ],
  },
  {
    id: 'membership',
    patterns: [
      /member(ship)?/i,
      /join\s+(ficcs|us)/i,
      /how\s+to\s+(join|apply|become)/i,
      /eligib(le|ility)/i,
      /apply/i,
      /registr(ation|er)/i,
      /sign\s*up/i,
    ],
  },
  {
    id: 'programs',
    patterns: [
      /program/i,
      /course/i,
      /exambuddy/i,
      /succex/i,
      /exam\s*(prep|preparation)/i,
      /training/i,
      /curriculum/i,
      /academic/i,
      /education/i,
    ],
  },
  {
    id: 'events',
    patterns: [
      /event/i,
      /upcoming/i,
      /conference/i,
      /webinar/i,
      /workshop/i,
      /schedule/i,
      /when\s+is/i,
    ],
  },
  {
    id: 'contact',
    patterns: [
      /contact/i,
      /reach\s*(out|us)?/i,
      /phone/i,
      /email/i,
      /whatsapp/i,
      /address/i,
      /get\s+in\s+touch/i,
      /how\s+to\s+contact/i,
    ],
  },
  {
    id: 'icu',
    patterns: [
      /icu/i,
      /intensivist/i,
      /critical\s+care/i,
      /ventilat/i,
      /sepsis/i,
      /organ\s+failure/i,
    ],
  },
  {
    id: 'thanks',
    patterns: [/thank/i, /thanks/i, /thx/i, /appreciate/i, /helpful/i],
  },
  {
    id: 'bye',
    patterns: [/^(bye|goodbye|see\s+you|take\s+care|cya)/i],
  },
];

function detectIntent(message) {
  const trimmed = message.trim();
  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (pattern.test(trimmed)) return intent.id;
    }
  }
  return 'unknown';
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const greetingVariations = [
  "Hello! 👋 I'm the FICCS assistant. I can help you with information about FICCS, our programs (EXAMBUDDY, SUCCEX-T), membership, upcoming events, and contact details. What would you like to know?",
  "Hi there! 😊 Welcome to FICCS. I can answer questions about membership, programs, events, critical care, and more. How can I help you today?",
  "Hey! 👋 Good to see you here. I'm the FICCS bot — ask me about our programs, membership process, upcoming events, or anything about critical care medicine.",
  "Namaste! 🙏 I'm here to help you with information about FICCS — from membership to programs to ICU best practices. What's on your mind?",
  "Hello! I'm the FICCS digital assistant. Whether you need info on EXAMBUDDY, SUCCEX-T, membership, or how to reach us — just ask! 💬",
];

const unknownVariations = [
  "I'm not sure I understand that. Here are some things I can help with:\n\n• **About FICCS** — What we do and who we are\n• **Programs** — EXAMBUDDY and SUCCEX-T details\n• **Membership** — How to join FICCS\n• **Events** — Upcoming and past programs\n• **Contact** — Phone, email, WhatsApp\n• **ICU / Critical Care** — Role of intensivists\n\nTry asking something like \"How do I join FICCS?\" or \"Tell me about EXAMBUDDY\".",
  "Hmm, I didn't quite catch that. 🤔 Here's what I know best:\n\n• FICCS overview and mission\n• EXAMBUDDY & SUCCEX-T programs\n• Membership eligibility & how to apply\n• Upcoming events and past programs\n• Contact details (WhatsApp, email, phone)\n\nCould you rephrase your question?",
  "I'm not sure about that one. Try asking me:\n\n• \"What is FICCS?\"\n• \"How to apply for membership?\"\n• \"Tell me about SUCCEX-T\"\n• \"Contact details\"\n• \"Upcoming events\"\n\nI'll do my best to help! 😊",
  "I don't have an answer for that right now. I'm best at:\n\n• FICCS info and critical care\n• Programs (EXAMBUDDY, SUCCEX-T)\n• Membership & eligibility\n• Events & schedules\n• Contact info\n\nFeel free to ask about any of these! 👆",
];

const thanksVariations = [
  "You're welcome! 😊 Feel free to ask anything else about FICCS. I'm here to help.",
  "Happy to help! Let me know if there's anything else you'd like to know. 👍",
  "Glad I could assist! Don't hesitate to ask if you have more questions. 🙌",
  "Anytime! 😊 I'm always here if you need more information about FICCS.",
];

const byeVariations = [
  "Goodbye! Take care. If you need anything later, I'm always here. 👋",
  "See you! 😊 Come back anytime you have questions about FICCS.",
  "Bye for now! Wishing you the best. Feel free to chat again anytime. 🙏",
  "Take care! 👋 The FICCS team is always here for you.",
];

// ─── Response builders ────────────────────────────────────────────────────────

async function buildGreeting() {
  return {
    text: pick(greetingVariations),
    suggestions: ['About FICCS', 'Programs', 'Membership', 'Contact'],
  };
}

async function buildAbout() {
  const AboutContent = getAboutContentModel();
  const about = await AboutContent.findOne();
  const plain = about ? about.toJSON() : {};
  const description =
    plain?.whoWeAre?.description ||
    'FICCS is a registered professional body of doctors dedicated to strengthening Critical Care Medicine as an independent super-specialty.';

  return {
    text: `**About FICCS**\n\n${description}`,
    suggestions: ['Membership', 'Programs', 'Contact'],
  };
}

async function buildMembership() {
  const MembershipPageContent = getMembershipPageContentModel();
  const content = await MembershipPageContent.findOne();
  const plain = content ? content.toJSON() : {};
  const eligibility = plain?.eligibilitySection?.items?.map((i) => i.text) || [];

  let text =
    '**FICCS Membership**\n\nFICCS membership is open to NMC-qualified Critical Care specialists with DM, DrNB, or FNB in Critical Care Medicine.\n\n';

  if (eligibility.length) {
    text += '**Eligibility:**\n' + eligibility.map((e) => `• ${e}`).join('\n') + '\n\n';
  }

  text +=
    '**How to apply:**\n1. Create an account on the website\n2. Fill the membership application form\n3. Upload required documents\n4. Admin reviews and approves\n\n👉 Visit /membership to apply.';

  return {
    text,
    suggestions: ['Programs', 'Contact', 'About FICCS'],
    link: { label: 'Apply Now', url: '/membership' },
  };
}

async function buildPrograms() {
  const Activity = getActivity();
  const Event = getEvent();
  const activities = await Activity.findAll({ order: [['createdAt', 'DESC']], limit: 6 });
  const events = await Event.findAll({ order: [['date', 'DESC']], limit: 4 });

  let text =
    '**FICCS Programs**\n\nFICCS runs structured exam-preparation programs for DM/DrNB Critical Care trainees:\n\n';
  text += '🎯 **EXAMBUDDY** — Practical exam preparation with simulated cases, table viva, and live debriefing by senior examiners.\n\n';
  text += '📚 **SUCCEX-T** — Domain-based theory preparation covering 12 critical-care domains with 25+ faculty.\n\n';

  if (activities.length) {
    text += '**Recent curriculum topics:**\n';
    text += activities.slice(0, 4).map((a) => `• ${a.title}`).join('\n');
    text += '\n\n';
  }

  if (events.length) {
    text += '**Recent programs/events:**\n';
    text += events.slice(0, 3).map((e) => `• ${e.title} (${new Date(e.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`).join('\n');
    text += '\n';
  }

  text += '\nFor inquiries about future editions, reach out via WhatsApp: +91 98748 92629';

  return {
    text,
    suggestions: ['Membership', 'Events', 'Contact'],
    link: { label: 'View Programs', url: '/activities' },
  };
}

async function buildEvents() {
  const Event = getEvent();
  const events = await Event.findAll({ order: [['date', 'DESC']], limit: 5 });

  let text = '**FICCS Events & Programs**\n\n';

  if (!events.length) {
    text += 'No upcoming events at the moment. Check back soon or follow FICCS for updates.';
  } else {
    text += events.map((e) => {
      const date = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const status = e.location?.includes('concluded') ? '(Concluded)' : '';
      return `📅 **${e.title}** ${status}\n   ${date} • ${e.location || 'Online'}`;
    }).join('\n\n');
  }

  text += '\n\nFor inquiries about future editions: WhatsApp +91 98748 92629';

  return {
    text,
    suggestions: ['Programs', 'Membership', 'Contact'],
    link: { label: 'All Events', url: '/activities' },
  };
}

async function buildContact() {
  const ContactPageContent = getContactPageContentModel();
  const contact = await ContactPageContent.findOne();
  const plain = contact ? contact.toJSON() : {};
  const phone = plain?.officePhone || '+91 98748 92629';
  const email = plain?.officeEmail || 'ficcsindia@yahoo.com';

  return {
    text:
      '**Contact FICCS**\n\n' +
      `📱 WhatsApp / Phone: ${phone}\n` +
      `📧 Email: ${email}\n` +
      '📍 India\n\n' +
      'The fastest way to reach the FICCS team is via WhatsApp.',
    suggestions: ['Membership', 'Programs', 'About FICCS'],
    link: { label: 'Contact Page', url: '/contact' },
  };
}

async function buildICU() {
  const AboutContent = getAboutContentModel();
  const about = await AboutContent.findOne();
  const plain = about ? about.toJSON() : {};
  const role = plain?.intensivistRole?.description || '';

  let text = '**Critical Care & The Intensivist**\n\n';

  if (role) {
    text += role + '\n\n';
  } else {
    text += 'An intensivist is the leader of the ICU team — coordinating with all specialties to deliver the best outcomes for critically ill patients.\n\n';
  }

  text += 'FICCS works to ensure that critically ill patients receive specialist care from properly trained doctors.';

  return {
    text,
    suggestions: ['About FICCS', 'Membership', 'Programs'],
    link: { label: 'Learn More', url: '/about' },
  };
}

function buildThanks() {
  return { text: pick(thanksVariations), suggestions: ['Programs', 'Membership', 'Contact'] };
}

function buildBye() {
  return { text: pick(byeVariations), suggestions: [] };
}

function buildUnknown() {
  return { text: pick(unknownVariations), suggestions: ['About FICCS', 'Programs', 'Membership', 'Contact'] };
}

// ─── Controller ───────────────────────────────────────────────────────────────

export const handleChatMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    res.status(400);
    throw new Error('Message is required');
  }

  const intent = detectIntent(message);

  let response;
  switch (intent) {
    case 'greeting': response = await buildGreeting(); break;
    case 'about': response = await buildAbout(); break;
    case 'membership': response = await buildMembership(); break;
    case 'programs': response = await buildPrograms(); break;
    case 'events': response = await buildEvents(); break;
    case 'contact': response = await buildContact(); break;
    case 'icu': response = await buildICU(); break;
    case 'thanks': response = buildThanks(); break;
    case 'bye': response = buildBye(); break;
    default: response = buildUnknown();
  }

  res.json({ intent, ...response });
});
