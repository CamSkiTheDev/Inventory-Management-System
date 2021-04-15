require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const indexRouter = require("./routers");

const db = mongoose.connection;

mongoose.connect(
  process.env.MONGODB_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error) => (error ? console.log("Connection Error: 01: ", error) : null)
);

db.on("open", () => console.log("Connected to mongodb"));
db.on("close", () => console.log("Connection to mongodb closed"));

const port = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: new MongoDBStore({
      uri: process.env.MONGODB_URL,
      collection: "sessions",
    }),
    resave: true,
  })
);

app.use("/", indexRouter);

app.listen(port, () => console.log(`Stocky running on port: ${port}`));
