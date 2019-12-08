const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/user");

const userController = require("../controllers/user");

router.use("/:id", async (req, res, next) => {
  const userOwner = await userModel.find({
    _id: mongoose.Types.ObjectId(req.params.id)
  });

  userOwner.length !== 0
    ? next()
    : next(`No such user with id: ${req.params.id}`);
});

router.post("/", userController.createUser);
router.get("/:id", userController.getUser);
router.get("/:id/articles", userController.getUsersArticles);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
