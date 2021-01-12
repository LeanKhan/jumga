const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const transactionSchema = new Schema(
  {
    tx_id: String,
    tx_ref: String,
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    actor: String,
    status: {
      type: String,
      default: 'verification_pending',
    },
    type: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    transaction: {},
  },
  { timestamps: true }
);

// Create the transaction model
const TransactionModel = mongoose.model('transaction', transactionSchema);

// Export the model
module.exports = TransactionModel;
