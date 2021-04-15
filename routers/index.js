const router = require("express").Router();
const Store = require("../models/Store");

const authRouter = require("./auth");
const dashboardRouter = require("./dashboard/index");

router.use(async (req, res, next) => {
  if (req.session.store)
    req.session.store = await Store.findById(req.session.store._id);
  next();
});

router.use("/auth", authRouter);

router.use("/dashboard", dashboardRouter);

module.exports = router;
