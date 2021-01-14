const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const shopSchema = new Schema(
  {
    shopID: String,
    name: String,
    slug: String,
    description: String,
    category: String,
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    account: {
      subaccount_id: { type: String, default: null },
      bank: String,
      account_number: String,
      account_name: String,
      full_name: String,
    },
    preferred_payment_method: String,
    isApproved: {
      type: Boolean,
      default: false,
    },
    country: String,
    country_id: { type: Schema.Types.ObjectId, ref: 'Country' },
    isLive: {
      type: Boolean,
      default: false,
    },
    hasPaidFee: {
      type: Boolean,
      default: false,
    },
    pictures: {
      banner_image: String,
      logo: String,
    },
    theme_color: String,
    transactions: [],
    dispatch_rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// On Save Hook, encrypt password
// Before saving a model, run this function

// Create the shop model
const ShopModel = mongoose.model('Shop', shopSchema);

// Export the model
module.exports = ShopModel;
