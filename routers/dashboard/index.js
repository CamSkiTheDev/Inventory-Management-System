const router = require("express").Router();
const Category = require("../../models/Category");
const Inventory = require("../../models/Inventory");

router.get("/", async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("category");

    res.render("dashboard/index", { inventory });
  } catch (error) {
    console.log(error);
  }
});

router.get("/new", async (req, res) => {
  const categories = await Category.find({});
  res.render("dashboard/new", { categories });
});

router.delete("/inventory/:id", async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);

  res.redirect("/dashboard");
});

router.put("/inventory/:id", async (req, res) => {
  if (req.body.cost > 0) req.body.cost = req.body.cost * 100;
  if (req.body.price > 0) req.body.price = req.body.price * 100;

  await Inventory.findByIdAndUpdate(req.params.id, { $set: { ...req.body } });

  res.redirect("/dashboard");
});

router.post("/category", async (req, res) => {
  try {
    const { title } = req.body;
    await new Category({ title }).save();

    res.redirect("/dashboard/new");
  } catch (error) {}
});

router.post("/inventory", async (req, res) => {
  try {
    if (req.body.cost > 0) req.body.cost = req.body.cost * 100;
    if (req.body.price > 0) req.body.price = req.body.price * 100;
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

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/inventory/:id/edit", async (req, res) => {
  const categories = await Category.find({});
  const item = await Inventory.findById(req.params.id);
  res.render("dashboard/edit", { categories, item });
});

router.get("/inventory/:id", async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id).populate("category");

    res.render("dashboard/show", { item });
  } catch (error) {}
});

module.exports = router;
