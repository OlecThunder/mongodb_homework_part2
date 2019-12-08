const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const articlesModel = require("../models/articles");

const articlesController = require("../controllers/articles");

router.use("/:id", async (req, res, next) => {
  const article = await articlesModel.find({
    _id: mongoose.Types.ObjectId(req.params.id)
  });

  article.length !== 0
    ? next()
    : next(`No such article with id: ${req.params.id}`);
});

router.post("/", articlesController.createArticle);
router.get("/", articlesController.getArticle);
router.put("/:id", articlesController.updateArticle);
router.delete("/:id", articlesController.deleteArticle);

module.exports = router;
