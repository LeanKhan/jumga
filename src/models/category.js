const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const categorySchema = new Schema(
  {
    name: String, // Fashion
    slug: String, // fashion
    item_name_singular: String, // Clothe,
    item_name_plural: String, // Clothes,
    icon: String, // url string maybe
  },
  { timestamps: true }
);

// Create the category model
const CategoryModel = mongoose.model('Category', categorySchema);

// Export the model
module.exports = CategoryModel;
