const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const songRoute = require("./routes/songRoute");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//initialize express app
var app = express();

//conect to DB
mongoose.connect(
  process.env.DB_URI_SERVER,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    else console.log("Database connection has been established");
  }
);
mongoose.set('useCreateIndex', true);// to avoid deprecation
mongoose.set('useFindAndModify', false);

//declare middlewares
app.use(cors());
app.use(express.json({ extended: false }));

//declare routes
app.use(authRoute);
app.use(userRoute);
app.use(songRoute);

if(process.env.NODE_ENV === "production")
{
  app.use(express.static(__dirname + "/dist"));
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
  })
}

//run express server in a port
var port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Express server has started on port ${port}`);
});
