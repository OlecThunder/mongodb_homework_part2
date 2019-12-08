const userModel = require("../models/user");
const articlesModel = require("../models/articles");
const mongoose = require("mongoose");
module.exports = {
  createUser,
  getUser,
  getUsersArticles,
  updateUser,
  deleteUser
};

// @type            Post request
// @description     Creates new user
async function createUser(req, res, next) {
  try {
    const newUser = await userModel.create(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (e) {
    next(e.message);
  }
}

// @type            Get request
// @description     Fetches user
async function getUser(req, res, next) {
  try {
    const user = await userModel.find({ _id: req.params.id });

    const usersArticles = await articlesModel.find({
      owner: mongoose.Types.ObjectId(req.params.id)
    });

    // UPDATING NUMBER OF ARTICLES VALUE
    await userModel.updateOne(
      { _id: req.params.id },
      { $set: { numberOfArticles: usersArticles.length } }
    );

    res.status(200).json({ success: true, data: { user, usersArticles } });
  } catch (e) {
    next(e);
  }
}

// @type            Get request
// @description     Fetches user's articles
async function getUsersArticles(req, res, next) {
  try {
    const usersArticles = await articlesModel.find({
      owner: mongoose.Types.ObjectId(req.params.id)
    });

    res.status(200).json({ success: true, data: usersArticles });
  } catch (e) {
    next(e);
  }
}

// @type            Put request
// @description     Updates user
async function updateUser(req, res, next) {
  try {
    const articlesCount = await articlesModel.find({
      owner: mongoose.Types.ObjectId(req.params.id)
    });

    const changedUser = await userModel.updateOne(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    // UPDATING NUMBER OF ARTICLES VALUE

    await userModel.updateOne(
      { _id: req.params.id },
      { $set: { numberOfArticles: articlesCount.length } }
    );

    res.status(200).json({ success: true, data: changedUser });
  } catch (e) {
    next(e);
  }
}

// @type            Delete request
// @description     Deletes user
async function deleteUser(req, res, next) {
  try {
    const deleteUser = await userModel.deleteOne({ _id: req.params.id });
    const deleteArticles = await articlesModel.deleteMany({
      owner: req.params.id
    });
    res.status(200).json({
      success: true,
      data: { user: deleteUser, usersArticles: deleteArticles }
    });
  } catch (e) {
    next(e);
  }
}
