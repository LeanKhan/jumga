const { Schema, model } = require('mongoose');

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
      banner_image: { type: String, default: '' },
      logo: { type: String, default: '' },
    },
    theme_color: { type: String, default: '#000000' },
    transactions: [],
    dispatch_rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const ShopModel = model('Shop', shopSchema);

module.exports = ShopModel;
