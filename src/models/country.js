const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const countrySchema = new Schema(
  {
    name: String, // Nigeria
    short_code: String, // NG
    currency_code: String, // NGN
    dollar_exchange_rate: String, // 380
    phonenumber_code: String, // +234
  },
  { timestamps: true }
);

// Create the country model
const CountryModel = mongoose.model('Country', countrySchema);

// Export the model
module.exports = CountryModel;
