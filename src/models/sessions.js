const { Schema, model } = require('mongoose');

/** this is so that I can access the auto-creates 'sessions'
 * collection.
 */
const sessionsSchema = new Schema({}, { strict: false });

const SessionsModel = model('Session', sessionsSchema, 'sessions');

module.exports = SessionsModel;
