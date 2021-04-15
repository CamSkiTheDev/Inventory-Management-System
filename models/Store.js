const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcryptjs");

const StoreSchema = new Schema({
  storeNumber: {
    type: String,
    required: true,
    default: () =>
      require("crypto").randomBytes(3).toString("hex").toUpperCase(),
  },
  password: {
    type: String,
    required: true,
  },
  inventory: [
    {
      type: Types.ObjectId,
      ref: "inventory",
    },
  ],
});

StoreSchema.methods.hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

StoreSchema.methods.isValidPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

const Store = model("store", StoreSchema);

module.exports = Store;
