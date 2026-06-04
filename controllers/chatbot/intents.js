/**
 * Chatbot intent definitions and static responses.
 *
 * Each intent has:
 * - id: unique identifier used to route to a response builder
 * - patterns: array of RegExp to match user input
 * - static: (optional) if true, response is picked from staticResponses
 */

export const intents = [
  {
    id: 'greeting',
    patterns: [/^(hi|hello|hey|good morning|good evening|howdy|greetings|namaste)/i, /^(yo|sup|what'?s up)/i],
    static: true,
  },
  {
    id: 'what_is_ficcs',
    patterns: [/what.*(is|about).*ficcs/i, /tell.*about.*ficcs/i, /ficcs.*kya/i, /who.*ficcs/i, /about.*ficcs/i, /ficcs.*organization/i],
  },
  {
    id: 'membership',
    patterns: [/member/i, /join/i, /how.*(to|can).*(join|apply|become)/i, /eligib/i, /sign.*up/i, /registr/i],
  },
  {
    id: 'programs',
    patterns: [/program/i, /course/i, /succex/i, /exambuddy/i, /exam.*prep/i, /academic/i, /curriculum/i, /training/i],
  },
  {
    id: 'events',
    patterns: [/event/i, /upcoming/i, /conference/i, /workshop/i, /webinar/i, /schedule/i],
  },
  {
    id: 'contact',
    patterns: [/contact/i, /reach/i, /email/i, /phone/i, /address/i, /whatsapp/i, /call/i, /connect/i],
  },
  {
    id: 'executive_committee',
    patterns: [/executive/i, /committee/i, /leadership/i, /team/i, /board/i, /founder/i, /who.*lead/i],
  },
  {
    id: 'icu',
    patterns: [/icu/i, /intensive.*care/i, /critical.*care/i, /intensivist/i, /ventilat/i, /sepsis/i],
  },
  {
    id: 'vision_mission',
    patterns: [/vision/i, /mission/i, /goal/i, /aim/i, /objective/i, /purpose/i],
  },
  {
    id: 'thanks',
    patterns: [/thank/i, /thanks/i, /thx/i, /appreciate/i, /shukriya/i, /dhanyavad/i],
    static: true,
  },
  {
    id: 'bye',
    patterns: [/bye/i, /goodbye/i, /see.*you/i, /take.*care/i, /alvida/i],
    static: true,
  },
  {
    id: 'help',
    patterns: [/help/i, /what.*can.*you/i, /options/i, /menu/i, /commands/i],
    static: true,
  },
];

export const staticResponses = {
  greeting: [
    "Hello! 👋 I'm the FICCS assistant. I can help you with information about FICCS, membership, programs, events, and more. What would you like to know?",
    "Hi there! Welcome to FICCS. How can I help you today? You can ask about membership, programs, events, or anything about critical care medicine.",
    "Namaste! 🙏 I'm here to help. Ask me about FICCS programs, membership, upcoming events, or our executive committee.",
  ],
  thanks: [
    "You're welcome! Let me know if you have any other questions. 😊",
    "Happy to help! Feel free to ask anything else about FICCS.",
    "Glad I could assist! Reach out anytime.",
  ],
  bye: [
    "Goodbye! Take care. Feel free to come back anytime you need help. 👋",
    "See you! If you need anything, the FICCS team is always here.",
    "Bye! Wishing you the best in your critical care journey. 🙏",
  ],
  help: [
    "Here's what I can help you with:\n\n🏥 **About FICCS** — What is FICCS, our mission & vision\n👥 **Membership** — How to join, eligibility, benefits\n📚 **Programs** — SUCCEX-T, EXAMBUDDY, academic tracks\n📅 **Events** — Upcoming conferences and workshops\n📞 **Contact** — How to reach the FICCS team\n🏛️ **Leadership** — Executive committee members\n\nJust type your question naturally!",
  ],
};

export const FALLBACK_RESPONSE =
  "I'm not sure I understand that query. Here are some things I can help with:\n\n" +
  "• What is FICCS?\n• How to join / membership\n• Programs (SUCCEX-T, EXAMBUDDY)\n• Upcoming events\n• Contact information\n• Executive committee\n• Critical care / ICU info\n• Vision & mission\n\nTry rephrasing or pick one of these topics!";
