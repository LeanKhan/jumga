/* eslint-disable camelcase */
const Agenda = require('agenda');

const address = process.env.MONGO_DB_URI.trim().toLowerCase();

/**
 * Agenda is used to schedule task for your code to do later.
 * - I use it to update the Country Exchange Rates and Delete Useless Sessions in the db
 */

const agenda = new Agenda({
  db: {
    address,
    collection: 'scheduledJobs',
    options: {
      useUnifiedTopology: true,
    },
  },
}).processEvery('2 minutes');

require('./jobs')(agenda);

(async function startAgenda() {
  await agenda.start();
  await agenda.every('1 day', 'update exchange rates', null, {
    timezone: 'Africa/Lagos',
  });

  await agenda.every('1 day', 'delete useless sessions', null, {
    timezone: 'Africa/Lagos',
  });
})()
  .then(() => {
    console.log('Started Agenda', new Date().toLocaleTimeString());
  })
  .catch((err) => {
    console.log('Error Starting Agenda ', err, new Date().toLocaleTimeString());
  });

module.exports = agenda;
