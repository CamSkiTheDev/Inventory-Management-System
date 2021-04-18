const router = require("express").Router();
const Category = require("../../models/Category");
const Inventory = require("../../models/Inventory");
const Store = require("../../models/Store");

router.get("/", async (req, res) => {
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
  req.body.cost > 0
    ? (req.body.cost = req.body.cost * 100)
    : (req.body.cost = 0);
  req.body.price > 0
    ? (req.body.price = req.body.price * 100)
    : (req.body.price = 0);
  !req.body.partNumber ? delete req.body.partNumber : null;

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
