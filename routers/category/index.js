const router = require("express").Router();

const categoryController = require("../../controllers/category");

router.post("/", categoryController.create);

module.exports = router;
