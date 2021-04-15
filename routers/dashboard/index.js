const router = require("express").Router();

router.get("/", (req, res) => res.render("dashboard/index"));

router.get("/new", (req, res) => res.render("dashboard/new"));

module.exports = router;
