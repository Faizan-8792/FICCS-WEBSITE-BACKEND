import { initUser, getUser } from './User.js';
import { initEvent, getEvent } from './Event.js';
import { initActivity, getActivity } from './Activity.js';
import { initMedia, getMedia } from './Media.js';
import { initMembership, getMembership } from './Membership.js';
import { initMessage, getMessage } from './Message.js';
import { initUserMessageState, getUserMessageState } from './UserMessageState.js';
import { initContact, getContact } from './Contact.js';
import { initHomeContent, getHomeContent } from './HomeContent.js';
import { initAboutContent, getAboutContent } from './AboutContent.js';
import { initMembershipPageContent, getMembershipPageContent } from './MembershipPageContent.js';
import { initContactPageContent, getContactPageContent } from './ContactPageContent.js';

/**
 * Initialize all Sequelize models and set up associations.
 * Call this once after sequelize.authenticate() succeeds.
 */
export const initModels = (sequelize) => {
  // Global hook: include `_id` in JSON output for frontend compatibility.
  // The frontend (React) was built for MongoDB which uses `_id`.
  // This avoids modifying 15+ frontend files.
  sequelize.addHook('afterDefine', (Model) => {
    const originalToJSON = Model.prototype.toJSON;
    Model.prototype.toJSON = function () {
      const values = originalToJSON ? originalToJSON.call(this) : { ...this.get() };
      if (values.id !== undefined) {
        values._id = values.id;
      }
      return values;
    };
  });

  // Initialize all models
  initUser(sequelize);
  initEvent(sequelize);
  initActivity(sequelize);
  initMedia(sequelize);
  initMembership(sequelize);
  initMessage(sequelize);
  initUserMessageState(sequelize);
  initContact(sequelize);
  initHomeContent(sequelize);
  initAboutContent(sequelize);
  initMembershipPageContent(sequelize);
  initContactPageContent(sequelize);

  // Set up associations
  const User = getUser();
  const Message = getMessage();
  const UserMessageState = getUserMessageState();

  // Message belongs to User (sentBy)
  Message.belongsTo(User, { foreignKey: 'sentBy', as: 'sender' });
  User.hasMany(Message, { foreignKey: 'sentBy' });

  // UserMessageState belongs to both User and Message
  UserMessageState.belongsTo(User, { foreignKey: 'userId' });
  UserMessageState.belongsTo(Message, { foreignKey: 'messageId' });
  User.hasMany(UserMessageState, { foreignKey: 'userId' });
  Message.hasMany(UserMessageState, { foreignKey: 'messageId' });
};

// Re-export getters for use in controllers
export {
  getUser,
  getEvent,
  getActivity,
  getMedia,
  getMembership,
  getMessage,
  getUserMessageState,
  getContact,
  getHomeContent,
  getAboutContent,
  getMembershipPageContent,
  getContactPageContent,
};
