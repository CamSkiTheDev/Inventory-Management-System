const router = require("express").Router();
const Store = require("../models/Store");

const authRouter = require("./auth");
const dashboardRouter = require("./dashboard/index");

router.use(async (req, res, next) => {
  if (req.session.store)
    req.session.store = await Store.findById(req.session.store._id);
  next();
});

const isAuthorized = (req, res, next) => {
  if (!req.session.store) return res.status(401).redirect("/auth/login");
  next();
};

router.use("/auth", authRouter);

router.use("/dashboard", isAuthorized, dashboardRouter);

module.exports = router;
