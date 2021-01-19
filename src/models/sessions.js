const { Schema, model } = require('mongoose');

const sessionsSchema = new Schema({}, { strict: false });

const SessionsModel = model('Session', sessionsSchema, 'sessions');

module.exports = SessionsModel;
