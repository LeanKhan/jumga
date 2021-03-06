const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    phonenumber: String,
    email: { type: String },
    password: String,
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', default: null },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    hasShop: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// On Save Hook, encrypt password
// Before saving a model, run this function

userSchema.methods.comparePassword = function comparePasswords(
  candidatePassword,
  callback
) {
  let isMatch;
  try {
    isMatch =
      candidatePassword.trim().toLowerCase() ===
      this.password.trim().toLowerCase();
  } catch (err) {
    return callback(err);
  }
  return callback(null, isMatch);
};

const UserModel = model('User', userSchema);

module.exports = UserModel;
