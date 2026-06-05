/**
 * Integration test — validates all models, associations, CRUD, and business logic
 * using in-memory SQLite (same Sequelize interface as MySQL).
 * Run: node scripts/test-integration.js
 */
import { Sequelize } from 'sequelize';
import { initModels, getUser, getEvent, getActivity, getMedia, getMembership, getMessage, getUserMessageState, getContact, getHomeContent, getAboutContent, getMembershipPageContent, getContactPageContent } from '../models/index.js';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ FAIL: ${label}`);
  }
}

async function run() {
  console.log('\n🔧 Setting up in-memory SQLite database...\n');
  const sequelize = new Sequelize('sqlite::memory:', { logging: false });
  initModels(sequelize);
  await sequelize.sync({ force: true });
  console.log('  Tables created.\n');

  // ─── TEST 1: User Model ───────────────────────────────────────────────
  console.log('📋 Test: User Model');
  const User = getUser();

  const user = await User.create({ name: 'John Doe', email: 'john@test.com', password: 'secret123' });
  assert(user.id > 0, 'User created with auto-increment id');
  assert(user.password.startsWith('$2'), 'Password is hashed (bcrypt)');
  assert(user.role === 'user', 'Default role is "user"');
  assert(user.status === 'pending', 'Default status is "pending"');

  const matchCorrect = await user.matchPassword('secret123');
  assert(matchCorrect === true, 'matchPassword(correct) returns true');

  const matchWrong = await user.matchPassword('wrong');
  assert(matchWrong === false, 'matchPassword(wrong) returns false');

  user.name = 'Jane Doe';
  await user.save();
  const reloaded = await User.findByPk(user.id);
  assert(reloaded.name === 'Jane Doe', 'User update + findByPk works');

  const found = await User.findOne({ where: { email: 'john@test.com' } });
  assert(found.id === user.id, 'findOne by email works');

  // ─── TEST 2: Event Model ──────────────────────────────────────────────
  console.log('\n📋 Test: Event Model');
  const Event = getEvent();

  const event = await Event.create({ title: 'SUCCEX-T 2025', description: 'Exam prep', date: new Date('2025-06-01') });
  assert(event.id > 0, 'Event created');
  assert(event.title === 'SUCCEX-T 2025', 'Event title correct');
  assert(event.membersOnlyContact === true, 'Default membersOnlyContact is true');

  const events = await Event.findAll();
  assert(events.length === 1, 'findAll returns 1 event');

  await event.update({ location: 'Mumbai' });
  assert(event.location === 'Mumbai', 'Event update works');

  // ─── TEST 3: Activity Model ───────────────────────────────────────────
  console.log('\n📋 Test: Activity Model');
  const Activity = getActivity();

  const activity = await Activity.create({
    type: 'academic',
    title: 'Sepsis Management',
    content: 'Deep dive into sepsis',
    highlights: ['Topic A', 'Topic B', 'Topic C'],
  });
  assert(activity.id > 0, 'Activity created');
  assert(Array.isArray(activity.highlights), 'highlights is an array');
  assert(activity.highlights.length === 3, 'highlights has 3 items');
  assert(activity.highlights[0] === 'Topic A', 'highlights[0] correct');

  // ─── TEST 4: Media Model ──────────────────────────────────────────────
  console.log('\n📋 Test: Media Model');
  const Media = getMedia();

  const media = await Media.create({ type: 'photo', title: 'Group Photo', url: 'https://example.com/photo.jpg' });
  assert(media.id > 0, 'Media created');
  assert(media.type === 'photo', 'Media type correct');

  // ─── TEST 5: Membership Model ─────────────────────────────────────────
  console.log('\n📋 Test: Membership Model');
  const Membership = getMembership();

  const membership = await Membership.create({
    name: 'Dr. Test',
    email: 'dr@test.com',
    mobile: '+91 9876543210',
    degrees: ['MBBS', 'MD', 'DM'],
    govtIdUrls: ['https://cdn.com/id1.jpg', 'https://cdn.com/id2.jpg'],
    degreeCertificateUrls: ['https://cdn.com/deg1.jpg'],
  });
  assert(membership.id > 0, 'Membership created');
  assert(membership.degrees.length === 3, 'JSON array degrees works');
  assert(membership.govtIdUrls.length === 2, 'JSON array govtIdUrls works');
  assert(membership.status === 'new', 'Default status is "new"');

  await membership.update({ status: 'approved' });
  assert(membership.status === 'approved', 'Status update works');

  // ─── TEST 6: Message + UserMessageState (associations) ────────────────
  console.log('\n📋 Test: Message + UserMessageState (associations)');
  const Message = getMessage();
  const UserMessageState = getUserMessageState();

  const msg = await Message.create({ title: 'Welcome', body: 'Hello members', sentBy: user.id });
  assert(msg.id > 0, 'Message created');
  assert(msg.sentBy === user.id, 'Foreign key sentBy correct');

  const state = await UserMessageState.create({ userId: user.id, messageId: msg.id, read: true });
  assert(state.read === true, 'UserMessageState created with read=true');

  // Test upsert (used in dismissMessage)
  const [upserted] = await UserMessageState.upsert({ userId: user.id, messageId: msg.id, dismissed: true, read: true });
  assert(upserted.dismissed === true, 'Upsert works (dismissed=true)');

  // Test unique constraint
  let duplicateError = false;
  try {
    await UserMessageState.create({ userId: user.id, messageId: msg.id, read: false });
  } catch (e) {
    duplicateError = true;
  }
  assert(duplicateError, 'Unique constraint on (userId, messageId) enforced');

  // ─── TEST 7: Contact Model ────────────────────────────────────────────
  console.log('\n📋 Test: Contact Model');
  const Contact = getContact();

  const contact = await Contact.create({ name: 'Visitor', email: 'vis@test.com', message: 'Hello' });
  assert(contact.id > 0, 'Contact created');
  assert(contact.status === 'new', 'Default status is "new"');

  // ─── TEST 8: HomeContent (singleton with JSON columns) ────────────────
  console.log('\n📋 Test: HomeContent (JSON columns)');
  const HomeContent = getHomeContent();

  const home = await HomeContent.create({
    heroTitle: 'Welcome to FICCS',
    founders: [{ name: 'Dr. A', role: 'President' }, { name: 'Dr. B', role: 'Secretary' }],
    impactStats: { eyebrow: 'Impact', heading: 'Our Numbers', items: [{ icon: 'star', value: 100 }] },
    focusAreas: [{ label: 'ICU', slug: 'icu' }],
  });
  assert(home.id > 0, 'HomeContent created');
  assert(home.founders.length === 2, 'JSON array founders works');
  assert(home.impactStats.heading === 'Our Numbers', 'Nested JSON object works');
  assert(home.focusAreas[0].label === 'ICU', 'JSON array of objects works');

  await home.update({ heroTitle: 'Updated Title' });
  assert(home.heroTitle === 'Updated Title', 'HomeContent update works');

  // ─── TEST 9: AboutContent ─────────────────────────────────────────────
  console.log('\n📋 Test: AboutContent');
  const AboutContent = getAboutContent();

  const about = await AboutContent.create({
    companyDescription: 'FICCS is...',
    founders: [{ name: 'Dr. X', title: 'Founder' }],
    whoWeAre: { eyebrow: 'Who', heading: 'We Are', description: 'A body of intensivists' },
    timeline: [{ year: '2020', title: 'Founded', description: 'Started ops' }],
  });
  assert(about.id > 0, 'AboutContent created');
  assert(about.whoWeAre.description === 'A body of intensivists', 'Nested JSON correct');

  // ─── TEST 10: MembershipPageContent ────────────────────────────────────
  console.log('\n📋 Test: MembershipPageContent');
  const MembershipPageContent = getMembershipPageContent();

  const mpc = await MembershipPageContent.create({
    heroTitle: 'Join FICCS',
    eligibilitySection: { eyebrow: 'Eligibility', items: [{ text: 'DM Critical Care' }] },
    benefitsSection: { items: [{ icon: 'check', title: 'Network', copy: 'Connect with peers' }] },
  });
  assert(mpc.id > 0, 'MembershipPageContent created');
  assert(mpc.eligibilitySection.items[0].text === 'DM Critical Care', 'Nested JSON items work');

  // ─── TEST 11: ContactPageContent ───────────────────────────────────────
  console.log('\n📋 Test: ContactPageContent');
  const ContactPageContent = getContactPageContent();

  const cpc = await ContactPageContent.create({
    headline: 'Get in Touch',
    officeEmail: 'Theficcs.india@gmail.com',
    officePhone: '+91 98748 92629',
  });
  assert(cpc.id > 0, 'ContactPageContent created');
  assert(cpc.officeEmail === 'Theficcs.india@gmail.com', 'Fields correct');

  // ─── TEST 12: Bulk operations (used in controllers) ────────────────────
  console.log('\n📋 Test: Bulk operations');
  await Event.bulkCreate([
    { title: 'Event 2', description: 'D2', date: new Date() },
    { title: 'Event 3', description: 'D3', date: new Date() },
  ]);
  const allEvents = await Event.findAll();
  assert(allEvents.length === 3, 'bulkCreate + findAll works (3 events total)');

  const count = await Event.count();
  assert(count === 3, 'count() works');

  // ─── TEST 13: Pagination (findAndCountAll) ─────────────────────────────
  console.log('\n📋 Test: Pagination');
  const { count: total, rows } = await Event.findAndCountAll({ limit: 2, offset: 0, order: [['date', 'ASC']] });
  assert(total === 3, 'findAndCountAll total correct');
  assert(rows.length === 2, 'findAndCountAll limit works');

  // ─── TEST 14: Destroy ──────────────────────────────────────────────────
  console.log('\n📋 Test: Destroy');
  const eventToDelete = await Event.findByPk(event.id);
  await eventToDelete.destroy();
  const afterDelete = await Event.count();
  assert(afterDelete === 2, 'destroy() removes record');

  // ─── TEST 15: Cascade / state cleanup ──────────────────────────────────
  console.log('\n📋 Test: Message state cleanup');
  await UserMessageState.destroy({ where: { messageId: msg.id } });
  const statesAfter = await UserMessageState.count();
  assert(statesAfter === 0, 'destroy({where}) cleans up states');

  // ─── RESULTS ───────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(50));
  console.log(`  TOTAL: ${passed + failed} tests | ✅ ${passed} passed | ❌ ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  await sequelize.close();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('💥 Test runner crashed:', err);
  process.exit(1);
});
