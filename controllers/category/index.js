const Category = require("../../models/Category");

module.exports = {
  create: async (req, res) => {
    try {
      const { title } = req.body;
      await new Category({ title }).save();

      res.redirect("/dashboard/inventory/new");
    } catch (error) {
      console.log(error);
    }
  },
};
