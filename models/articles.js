const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    minlength: [5, "Title min-length = 5"],
    maxlength: [400, "Title max-length = 400"],
    index: true,
    required: [true, "Title wasn't specified"]
  },
  subtitle: { type: String, minlength: 5, required: false },
  description: {
    type: String,
    minlength: [5, "Description min-length = 5"],
    maxlength: [5000, "Description max-length = 5000"],
    required: [true, "Description wasn't specified"]
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Owner wasn't specified"]
  },
  category: {
    type: String,
    enum: ["sport", "games", "history"],
    required: [true, "Article category wasn't specified"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true, "Create date wasn't specified"]
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: [true, "Update date wasn't specified"]
  }
});

module.exports = mongoose.model("Article", ArticleSchema);
