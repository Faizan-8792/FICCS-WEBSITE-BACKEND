# FICCS Backend — MongoDB → MySQL Migration Roadmap

## Problem
Currently using MongoDB Atlas (cloud). Moving to Hostinger's built-in MySQL DB to reduce cost/complexity. All functionality stays the same.

---

## Task-Wise Migration Plan

### Phase 1: Setup & Configuration
- [x] **Task 1.1** — Install `sequelize` + `mysql2`, uninstall `mongoose`
- [x] **Task 1.2** — Rewrite `config/db.js` → Sequelize MySQL connection
- [x] **Task 1.3** — Update `.env` / `.env.example` with MySQL credentials
- [x] **Task 1.4** — Create `config/sequelize.js` (Sequelize instance export — merged into `config/db.js`)

### Phase 2: Model Conversion (12 models)
- [x] **Task 2.1** — Convert `models/User.js` (+ password hooks)
- [x] **Task 2.2** — Convert `models/Event.js`
- [x] **Task 2.3** — Convert `models/Activity.js` (has JSON array: highlights)
- [x] **Task 2.4** — Convert `models/Media.js`
- [x] **Task 2.5** — Convert `models/Membership.js` (has JSON arrays: degrees, govtIdUrls, degreeCertificateUrls)
- [x] **Task 2.6** — Convert `models/Message.js` (has foreign key → User)
- [x] **Task 2.7** — Convert `models/UserMessageState.js` (compound unique index)
- [x] **Task 2.8** — Convert `models/Contact.js`
- [x] **Task 2.9** — Convert `models/HomeContent.js` (deeply nested — use JSON columns)
- [x] **Task 2.10** — Convert `models/AboutContent.js` (deeply nested — use JSON columns)
- [x] **Task 2.11** — Convert `models/MembershipPageContent.js` (nested — JSON columns)
- [x] **Task 2.12** — Convert `models/ContactPageContent.js`
- [x] **Task 2.13** — Create `models/index.js` (associations + sync export)

### Phase 3: Controller Updates (12 controllers)
- [x] **Task 3.1** — Update `controllers/authController.js`
- [x] **Task 3.2** — Update `controllers/eventController.js`
- [x] **Task 3.3** — Update `controllers/activityController.js`
- [x] **Task 3.4** — Update `controllers/mediaController.js`
- [x] **Task 3.5** — Update `controllers/membershipController.js`
- [x] **Task 3.6** — Update `controllers/messageController.js`
- [x] **Task 3.7** — Update `controllers/contactController.js`
- [x] **Task 3.8** — Update `controllers/homeContentController.js`
- [x] **Task 3.9** — Update `controllers/aboutController.js`
- [x] **Task 3.10** — Update `controllers/membershipPageContentController.js`
- [x] **Task 3.11** — Update `controllers/userController.js`
- [x] **Task 3.12** — Update `controllers/chatbotController.js`

### Phase 4: Supporting Files
- [x] **Task 4.1** — Update `middleware/authMiddleware.js` (user lookup)
- [x] **Task 4.2** — Update `config/bootstrapAdmin.js`
- [x] **Task 4.3** — Update `scripts/seedAdminContent.js`
- [x] **Task 4.4** — Update `scripts/dropStaleIndexes.js` (no-op placeholder)
- [x] **Task 4.5** — Update `index.js` (startup: sequelize.sync + connect)

### Phase 5: Testing & Deployment
- [x] **Task 5.1** — Run server locally (46 files import OK, syntax check passes)
- [x] **Task 5.2** — Integration tests: 48/48 pass (User, Event, Activity, Media, Membership, Message, UserMessageState, Contact, HomeContent, AboutContent, MembershipPageContent, ContactPageContent, bulk ops, pagination, destroy, JSON arrays, associations, password hashing, upsert, unique constraints)
- [ ] **Task 5.3** — Deploy to Hostinger with MySQL credentials
- [ ] **Task 5.4** — Verify production health endpoint

---

## Key Mapping Decisions

| MongoDB Pattern | MySQL/Sequelize Equivalent |
|---|---|
| `mongoose.Schema` | `sequelize.define()` |
| `_id` (ObjectId) | `id` (INT AUTO_INCREMENT) — a global `toJSON` hook in `models/index.js` also exposes `_id` on every model for frontend compatibility |
| `{ timestamps: true }` | `timestamps: true` in Sequelize |
| Embedded arrays (`[String]`) | JSON column |
| Nested objects (founders, etc.) | JSON column |
| `ref: 'User'` (ObjectId) | Foreign key (INTEGER) |
| `.find()` | `.findAll()` |
| `.findById()` | `.findByPk()` |
| `.findOne()` | `.findOne({ where: {} })` |
| `.create()` | `.create()` |
| `.findByIdAndUpdate()` | `.update()` then `.findByPk()` |
| `.findByIdAndDelete()` | `.destroy()` |
| `.countDocuments()` | `.count()` |
| `pre('save')` hook | `beforeCreate` / `beforeUpdate` hook |

---

## .env Variables (New)
```
DB_HOST=your-hostinger-mysql-host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## Validation Summary

### Static Analysis
- ✅ `node --check index.js` — syntax valid
- ✅ 46/46 files import successfully (zero resolution errors)

### Integration Tests (48 tests)
- ✅ User: create, bcrypt hash, matchPassword, findByPk, findOne, update
- ✅ Event: create, defaults, findAll, update, bulkCreate, count, pagination, destroy
- ✅ Activity: create, JSON array (highlights)
- ✅ Media: create, type enum
- ✅ Membership: create, JSON arrays (degrees, govtIdUrls, degreeCerts), status update
- ✅ Message: create, foreign key (sentBy → User)
- ✅ UserMessageState: create, upsert, unique constraint enforced
- ✅ Contact: create, default status
- ✅ HomeContent: create, nested JSON objects, JSON arrays of objects, update
- ✅ AboutContent: create, nested JSON
- ✅ MembershipPageContent: create, nested JSON items
- ✅ ContactPageContent: create, fields

---

## Progress Tracker
- Phase 1: ✅ Complete
- Phase 2: ✅ Complete
- Phase 3: ✅ Complete
- Phase 4: ✅ Complete
- Phase 5: ✅ Code tested (48/48 pass) — pending only deployment (needs Hostinger MySQL credentials)
