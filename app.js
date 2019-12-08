const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const helmet = require("helmet");

const api = require("./routes");
const app = express();

const mongoose = require("mongoose");
const dev_db_url = "mongodb://localhost/mongoHomework";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", api);

//Error handler

app.use("", (err, req, res, next) => {
  res.status(400).json({ success: false, message: err });
});

const port = 4040;

app.listen(port, () => {
  console.log("Server is up and running on port numner " + port);
});
