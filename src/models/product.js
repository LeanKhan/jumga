const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const productSchema = new Schema(
  {
    name: String,
    slug: String,
    category: String,
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    description: String,
    price: String,
    tags: [{ type: String }],
    pictures: [{ type: String }],
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  { timestamps: true }
);

// Create the product model
const ProductModel = mongoose.model('Product', productSchema);

// Export the model
module.exports = ProductModel;
