const router = require("express").Router();
const User = require("../models/userModel");
const Token = require("../models/resetPasswordModel");
const crypto = require("crypto");
const sendingOut = require("../utilities/sendEmail");
const { hash } = require("bcrypt");
const auth = require("../middleware/auth");
const sendingJWT = require("../Utilities/sendingJWT");
const bcrypt = require("bcrypt");

router.get("/test", (req, res) => {
  console.log("backend server connected ");
});

router.post("/register", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    let foundUser = await User.findOne({ username });

    if (foundUser) {
      return res
        .status(400)
        .json({ message: "registration fail, username already exists" });
    }

    newlyRegisteredUser = new User({
      username,
      password,
      email,
    });

    newlyRegisteredUser.password = await newlyRegisteredUser.generateBcrypt(); ///THIS KEYWORD NOT APPLICABLE
    newlyRegisteredUser.token = await newlyRegisteredUser.generateJWT();

    let savedUser = await newlyRegisteredUser.save();

    return res.json({
      message: "registration success",
      details: { savedUser },
    });
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
    res.json({ message: "registration failure" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "please provide username or password" });
    }

    let foundOne = await User.findOne({ username });
    if (!foundOne) {
      return res.status(400).json({ message: "invalid username" });
    }

    const matchedPassword = await foundOne.comparePassword(password);

    if (!matchedPassword) {
      return res.status(400).json({ message: "password doesn't match" });
    }

    sendingJWT(foundOne, res);

    res.json({ message: "login success", foundOne });
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    return res.json({ message: "login failure" });
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const foundOne = await User.findOne({ email: req.body.email });

    if (!foundOne) {
      return res
        .status(404)
        .json({ message: "email has not been registered before" });
    }

    let foundToken = await Token.findOne({ userId: foundOne._id });
    if (foundToken) {
      await foundToken.deleteOne();
    }

    newlyGeneratedToken = await new Token({
      userId: foundOne._id,
      token: crypto.randomBytes(32).toString("hex"),
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.BASE_URL}/user/resetPassword/${foundOne._id}/${newlyGeneratedToken.token}`;
    console.log(link);
    await sendingOut(foundOne.email, link);
    return res.json({ message: "email has been sent" });
  } catch (err) {
    return res.send(err.message);
  }
});

//首先係database set個維持10分鍾既token schema
//再拎token 做url
//token expire = url expire
//對到token資料 ＝ 可以改密碼
//改完密碼del返token 確保無其他人再用到url

router.post("/resetPassword/:userId/:token", async (req, res) => {
  try {
    const foundOne = await User.findById(req.params.userId);
    if (!foundOne) {
      return res.status(400).json({ message: "cannot find user by ID" });
    }

    const foundToken = await Token.findOne({
      userId: foundOne._id,
      token: req.params.token,
    });
    if (!foundToken)
      return res.status(400).json({ message: "invalid or expired token" });

    foundOne.password = req.body.password; //O
    const hashed = await bcrypt.hash(foundOne.password, 10);
    foundOne.password = hashed;
    await foundOne.save();

    // await foundToken.deleteOne();

    return res.json({ message: "reset password success", foundOne });
  } catch (error) {
    return res.status(500).json({ message: "reset password error" });
  }
});

router.post("/logout", auth, (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
  }
});

module.exports = router;
