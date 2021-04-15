const { Schema, Types, model } = require("mongoose");

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Types.ObjectId,
      ref: "inventory",
    },
  ],
});

const Category = model("category", CategorySchema);

module.exports = Category;
