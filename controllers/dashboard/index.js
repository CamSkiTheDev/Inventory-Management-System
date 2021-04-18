const Category = require("../../models/Category");
const Inventory = require("../../models/Inventory");

module.exports = {
  index: async (req, res) => {
    try {
      const inventory = await Inventory.find({
        store: req.session.store._id,
      }).populate("category");
      const categories = await Category.find().populate("products");

      const inventoryTotals = {
        cost: inventory.reduce(
          (total, item) => (total += item.cost * item.quanity),
          0
        ),
        value: inventory.reduce(
          (total, item) => (total += item.price * item.quanity),
          0
        ),
        profit:
          inventory.reduce(
            (total, item) => (total += item.price * item.quanity),
            0
          ) -
          inventory.reduce(
            (total, item) => (total += item.cost * item.quanity),
            0
          ),
      };

      let categoryTotals = categories.map((category) => {
        return {
          title: category.title,
          cost: category.products.reduce(
            (total, item) => (total += item.cost * item.quanity),
            0
          ),
          value: category.products.reduce(
            (total, item) => (total += item.price * item.quanity),
            0
          ),
          profit:
            category.products.reduce(
              (total, item) => (total += item.price * item.quanity),
              0
            ) -
            category.products.reduce(
              (total, item) => (total += item.cost * item.quanity),
              0
            ),
        };
      });

      res.render("dashboard/index", {
        inventory,
        inventoryTotals,
        categoryTotals,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
