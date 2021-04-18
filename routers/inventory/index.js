const router = require("express").Router();

const inventoryController = require("../../controllers/inventory");

router.get("/new", inventoryController.new);

router.delete("/:id", inventoryController.delete);

router.put("/:id", inventoryController.update);

router.post("/", inventoryController.create);

router.get("/:id/edit", inventoryController.edit);

router.get("/:id", inventoryController.show);

module.exports = router;
