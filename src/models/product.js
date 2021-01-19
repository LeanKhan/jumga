const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: String,
    slug: String,
    price: String,
    picture: String,
    description: String,
    tags: [{ type: String }],
    shop_slug: String,
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  { timestamps: true }
);

const ProductModel = model('Product', productSchema);

module.exports = ProductModel;
