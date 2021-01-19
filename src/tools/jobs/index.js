const fetch = require('node-fetch');
const Country = require('../../models/country');
const Session = require('../../models/sessions');

const FIXER_API = process.env.FIXER_API.trim();

module.exports = async function (agenda) {
  /**
   * I need to update the Exhcnage rates from time to time. Kind obvious.
   * I am dividing by the USD value because this API doesn't let me cahnge the base
   * currency, which is EUR by default.
   */
  agenda.define('update exchange rates', async (job, done) => {
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

  /**
   *  For some reason I don't know, on every page request Express Sessions creates a Session with a cookie
   *  This quickly becomes a lot of useless sessions. I don't even use sessions like taht in the app.
   */
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
