const userRoutes = require("./user.route");
const articlesRoutes = require("./articles.route");
const express = require("express");
const router = express.Router();

router.use("/users", userRoutes);
router.use("/articles", articlesRoutes);
router.all("*", (req, res) => {
  res
    .status(404)
    .json({ success: false, message: "Fatal 404, there isn't such a page" });
});

module.exports = router;
