const Store = require("../../models/Store");

module.exports = {
  index: (req, res) => {
    if (req.session.store) return res.redirect("/dashboard");
    res.render("auth/login");
  },
  login: async (req, res) => {
    try {
      const { storeNumber, password } = req.body;

      const store = await Store.findOne({ storeNumber });

      if (!store || !store.isValidPassword(password, store.password))
        return res.render("auth/login", {
          error: { msg: "Invalid Store Number/Password Combo." },
        });

      req.session.store = store;

      return res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      return res.render("auth/login", { error: { msg: "Server Error" } });
    }
  },
  new: (req, res) => {
    if (req.session.store) return res.redirect("/dashboard");
    res.render("auth/signup");
  },
  signup: async (req, res) => {
    try {
      const { invitationCode, password } = req.body;

      if (invitationCode !== "27017")
        return res.render("auth/signup", {
          error: { msg: "Invalid Invitation Code" },
        });

      const store = new Store();
      store.password = store.hashPassword(password);

      await store.save();

      return res.render("auth/signup", {
        success: {
          msg: `Welcome to Stocky, your store number is ${store.storeNumber}. DO NOT LOOSE YOUR STORE NUMBER.`,
        },
        store,
      });
    } catch (error) {
      console.log(error);
      return res.render("auth/signup", { error: { msg: "Server Error" } });
    }
  },
  destroy: (req, res) => {
    req.session.destroy();
    return res.redirect("/");
  },
};
