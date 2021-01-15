const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
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

// Create the product model
const ProductModel = mongoose.model('Product', productSchema);

// Export the model
module.exports = ProductModel;
