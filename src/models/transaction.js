const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const transactionSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      default: 'payment_pending',
    },
    fw_transaction: {},
  },
  { timestamps: true }
);

// Create the transaction model
const TransactionModel = mongoose.model('transaction', transactionSchema);

// Export the model
module.exports = TransactionModel;
