const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    minlength: [4, "Firstname min-length = 4"],
    maxlength: [50, "Firstname max-length = 50"],
    required: [true, "User should have first name"]
  },
  lastName: {
    type: String,
    minlength: [3, "Lastname min-length = 3"],
    maxlength: [60, "Lastname max-length = 60"],
    required: [true, "User should have last name"]
  },
  role: { type: String, enum: ["admin", "writer", "guest"] },
  createdAt: { type: Date, default: Date.now },
  numberOfArticles: { type: Number, default: 0, required: false },
  nickname: { type: String, required: false }
});

module.exports = mongoose.model("User", UserSchema);
