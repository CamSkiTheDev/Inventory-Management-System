const { Schema, Types, model } = require("mongoose");

const ItemSchema = new Schema({
  store: [
    {
      type: Types.ObjectId,
      ref: "store",
      required: true,
    },
  ],
  category: [
    {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },
  ],
  title: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  partNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
  },
  quanity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Item = model("inventory", ItemSchema);

module.exports = Item;
