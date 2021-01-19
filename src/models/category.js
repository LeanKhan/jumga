const { Schema, model } = require('mongoose');

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

const CategoryModel = model('Category', categorySchema);

module.exports = CategoryModel;
