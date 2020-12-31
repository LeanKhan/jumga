const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const riderSchema = new Schema(
  {
    riderID: String,
    name: { type: String, lowercase: true },
    picture: String,
  },
  { timestamps: true }
);

// Create the rider model
const RiderModel = mongoose.model('rider', riderSchema);

// Export the model
module.exports = RiderModel;
