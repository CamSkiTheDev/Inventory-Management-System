const router = require("express").Router();

const authController = require("../../controllers/auth");

router.get("/login", authController.index);

router.post("/login", authController.login);

router.get("/signup", authController.new);

router.post("/signup", authController.signup);

router.get("/logout", authController.destroy);

module.exports = router;
