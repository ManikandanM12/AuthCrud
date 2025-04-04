const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { isLoggedIn } = require("./controller/authController.js");
const postRoutes = require("./routes/postRoutes");
const dotenv = require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
const PORT = 5000;

app.use(express.json());
app.use(
  cors()
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
//MONGODB CONNECTION
const db = mongoose
  .connect(process.env.MONGODB_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.get("/", isLoggedIn, (req, res) => {
  if (!req.cookies.token) {
    return res.redirect("/login");
  }
  res.send("Welcome to the Home Page");
});

//CRUD

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
