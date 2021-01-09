const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const categorySchema = new Schema(
  {
    name: String, // Fashion
    item_name: String, // Clothes,
    icon: String,
  },
  { timestamps: true }
);

// Create the category model
const CategoryModel = mongoose.model('Category', categorySchema);

// Export the model
module.exports = CategoryModel;
