const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const productSchema = new Schema(
  {
    name: String,
    slug: String,
    category: String,
    description: String,
    price: String,
    pictures: [{ type: String }],
  },
  { timestamps: true }
);

// Create the product model
const ProductModel = mongoose.model('product', productSchema);

// Export the model
module.exports = ProductModel;
