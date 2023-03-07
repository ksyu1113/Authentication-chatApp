const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECERT;

module.exports = async function (req, res, next) {

  const reqToken = req.header("authorization");
  if (!reqToken) {
    return res.status(401).json({ message: "Please login to proceed" });
  }
  
  try {
    const splitToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(splitToken, secret);
    const foundUser = await User.findOne({
      _id: decoded.id,
      token: reqToken, //<<<<<import debug milestone
    });

    next();
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    res.json({ message: "authorization failure" });

    // res.status(500).json({ message: "Auth middleware server error"});
  }
};
