const Category = require("../../models/Category");
const Inventory = require("../../models/Inventory");
const Store = require("../../models/Store");

module.exports = {
  new: async (req, res) => {
    try {
      const categories = await Category.find({});
      res.render("inventory/new", { categories });
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res) => {
    try {
      await Inventory.findByIdAndDelete(req.params.id);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  },
  update: async (req, res) => {
    try {
      req.body.cost > 0
        ? (req.body.cost = req.body.cost * 100)
        : (req.body.cost = 0);
      req.body.price > 0
        ? (req.body.price = req.body.price * 100)
        : (req.body.price = 0);
      !req.body.partNumber ? delete req.body.partNumber : null;

      await Inventory.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body },
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  },
  create: async (req, res) => {
    try {
      req.body.cost > 0
        ? (req.body.cost = req.body.cost * 100)
        : (req.body.cost = 0);
      req.body.price > 0
        ? (req.body.price = req.body.price * 100)
        : (req.body.price = 0);
      !req.body.partNumber ? delete req.body.partNumber : null;

      let inventory = await Inventory.findOne({ sku: req.body.sku });
      const category = await Category.findById(req.body.category);

      if (inventory) {
        inventory.store.push(req.session.store._id);
        await inventory.save();
      } else {
        inventory = await new Inventory({
          store: req.session.store._id,
          ...req.body,
        }).save();
      }

      category.products.push(inventory._id);
      await category.save();

      await Store.findByIdAndUpdate(req.session.store._id, {
        $push: { inventory },
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  },
  edit: async (req, res) => {
    try {
      const categories = await Category.find({});
      const item = await Inventory.findById(req.params.id);
      res.render("inventory/edit", { categories, item });
    } catch (error) {
      console.log(error);
    }
  },
  show: async (req, res) => {
    try {
      const item = await Inventory.findById(req.params.id).populate("category");

      res.render("inventory/show", { item });
    } catch (error) {
      console.log(error);
    }
  },
};
