const fetch = require('node-fetch');
const Country = require('../../models/country');
const Session = require('../../models/sessions');

const FIXER_API = process.env.FIXER_API.trim();

module.exports = async function (agenda) {
  agenda.define('update exchange rates', async (job, done) => {
    // use node-fetch to fetch exchange rate data from fixer.io and
    try {
      const config = {
        method: 'get',
      };

      let rates = null;

      const res = await fetch(
        `http://data.fixer.io/api/latest?access_key=${FIXER_API}&symbols=NGN,KES,GHS,GBP,USD`,
        config
      );

      rates = await res.json();

      console.log(rates);

      if (rates.success) {
        const currencies = [
          { code: 'NGN' },
          { code: 'KES' },
          { code: 'GHS' },
          { code: 'GBP' },
        ];

        const bulk = [];

        currencies.forEach((c) => {
          bulk.push({
            updateOne: {
              filter: { currency_code: c.code },
              update: {
                $set: {
                  dollar_exchange_rate: rates.rates[c.code] / rates.rates.USD,
                },
              },
            },
          });
        });

        Country.bulkWrite(bulk).then((t) => {
          console.log(`Modified Count: ${t.modifiedCount}`);

          return done();
        });
      }
    } catch (err) {
      console.error('error updating exchange rates...', err);
      throw err;
    }
  });

  agenda.define('delete useless sessions', async (job, done) => {
    try {
      await Session.deleteMany({ 'session.user': { $exists: false } });

      console.log('Useless Sessions deleted successfully!');

      return done();
    } catch (err) {
      console.log('ERROR DELETNG OLD SESSIONS', err);

      throw err;
    }
  });
};
