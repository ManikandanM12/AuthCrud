const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");
exports.isLoggedIn = async (req, res, next) => {
  try {
   const token = await req.cookies.token;
    if (!token) {
      return res.redirect("/login")
        
    }

    const decoded =await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password"); // Exclude password

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

