const router = require("express").Router();
const inventoryRouter = require("../inventory");
const categoryRouter = require("../category");

const dashboardController = require("../../controllers/dashboard");

router.get("/", dashboardController.index);

router.use("/inventory", inventoryRouter);

router.use("/category", categoryRouter);

module.exports = router;
