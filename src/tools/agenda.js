/* eslint-disable camelcase */
const Agenda = require('agenda');

const address = process.env.MONGO_DB_URI.trim().toLowerCase();

const agenda = new Agenda({
  db: {
    address,
    collection: 'scheduledJobs',
    options: {
      useUnifiedTopology: true,
    },
  },
}).processEvery('2 minutes');

// Send Job follow up email...

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
    console.log(
      'Started Agenda [inside async function]: ',
      new Date().toLocaleTimeString()
    );
  })
  .catch((err) => {
    console.log(
      'Error Starting Agenda [inside async function]: ',
      err,
      new Date().toLocaleTimeString()
    );
  });

// agenda.start();

// agenda.every('10 mins', 'check for today jobs');

console.log(
  'Started Agenda [outside async function]: ',
  new Date().toLocaleTimeString()
);

module.exports = agenda;
