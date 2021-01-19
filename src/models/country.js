const { Schema, model } = require('mongoose');

const countrySchema = new Schema(
  {
    name: String, // Nigeria
    short_code: String, // NG
    currency_code: String, // NGN
    dollar_exchange_rate: String, // 380
    phonenumber_code: String, // +234,
    payment_methods: [],
    fw_processing_fees: {
      international: String,
      local: String,
    },
  },
  { timestamps: true }
);

const CountryModel = model('Country', countrySchema);

module.exports = CountryModel;
