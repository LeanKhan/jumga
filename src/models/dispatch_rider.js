const { Schema, model } = require('mongoose');

const riderSchema = new Schema(
  {
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    phonenumber: String,
    bio: { type: String, default: 'A Jumga Dispatch Rider' },
    picture: String,
    employed: {
      type: Boolean,
      default: false,
    },
    account: {
      subaccount_id: String,
      full_name: String,
      bank: String,
      account_number: String,
      account_name: String,
      country: String,
      currency: String,
    },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  { timestamps: true }
);

const RiderModel = model('Rider', riderSchema);

module.exports = RiderModel;
