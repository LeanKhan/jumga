const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define our model
const messageSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: 'Shop' },
    message: {
      type: String,
    },
    message_type: String,
  },
  { timestamps: true }
);

// Create the message model
const MessageModel = mongoose.model('message', messageSchema);

// Export the model
module.exports = MessageModel;
