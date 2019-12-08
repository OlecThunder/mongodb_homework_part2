const userModel = require("../models/user");
const articlesModel = require("../models/articles");
const mongoose = require("mongoose");
module.exports = { createArticle, getArticle, updateArticle, deleteArticle };

// @type            Post request
// @description     Creates new article
async function createArticle(req, res, next) {
  try {
    const userOwner = await userModel.find({
      _id: mongoose.Types.ObjectId(req.body.owner)
    });

    if (userOwner.length === 0)
      throw `No such owner with id: ${req.body.owner}`;

    const newArticle = await articlesModel.create(req.body);

    await userModel.updateOne(
      { _id: mongoose.Types.ObjectId(req.body.owner) },
      { $inc: { numberOfArticles: 1 } }
    );
    res.status(201).json({ success: true, data: newArticle });
  } catch (e) {
    e.message === undefined
      ? next("There is no existant user that owns article")
      : next(e.message);
  }
}

// @type            Get request
// @description     Fetches an article
async function getArticle(req, res, next) {
  try {
    const queryObj = { ...req.query };
    const excludedFields = [
      "title",
      "subtitle",
      "description",
      "owner",
      "category",
      "createdAt",
      "updatedAt"
    ];
    let finalFilter = {};

    for (key in queryObj) {
      excludedFields.forEach(item => {
        key === item ? (finalFilter[key] = queryObj[key]) : null;
      });
    }

    const articles = await articlesModel.find(finalFilter).populate("owner");

    res.status(200).json({ success: true, data: articles });
  } catch (e) {
    next("Smth happened with articles");
  }
}

// @type            Put request
// @description     Updates an article
async function updateArticle(req, res, next) {
  try {
    const ownerExist = await articlesModel
      .find({ _id: mongoose.Types.ObjectId(req.params.id) })
      .populate("owner");

    if (ownerExist[0].owner === null) {
      await articlesModel.deleteOne({ _id: req.params.id });
      throw `There's no owner in this article, so it will be removed`;
    }

    const changeArticle = await articlesModel.updateOne(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    await articlesModel.updateOne(
      { _id: req.params.id },
      { $set: { updatedAt: new Date() } }
    );

    res.status(200).json({ success: true, data: changeArticle });
  } catch (e) {
    e.message === undefined ? next(e) : next(e.message);
  }
}

// @type            Delete request
// @description     Deletes an article
async function deleteArticle(req, res, next) {
  try {
    const ownerExist = await articlesModel
      .find({ _id: mongoose.Types.ObjectId(req.params.id) })
      .populate("owner");

    if (ownerExist[0].owner === null)
      throw `No such owner with id: ${req.params.id}`;

    const article = await articlesModel.deleteOne({ _id: req.params.id });

    await userModel.updateOne(
      { _id: mongoose.Types.ObjectId(ownerExist[0].owner._id) },
      { $inc: { numberOfArticles: -1 } }
    );

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (e) {
    e.message === undefined ? next(e) : next(e.message);
  }
}
