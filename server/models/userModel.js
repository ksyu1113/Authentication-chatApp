require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashValue = await bcrypt.hash(this.password, salt);
    return hashValue;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    console.log("pre-save problem");
  }
});

userSchema.methods.generateBcrypt = async function () {
  const User = this;
  const salt = await bcrypt.genSalt(10);
  const hashValue = await bcrypt.hash(User.password, salt);
  return hashValue;
};

userSchema.methods.comparePassword = async function (password) {
  const comparedPassword = await bcrypt.compare(password, this.password);
  if (comparedPassword) {
    return comparedPassword;
  } else {
    return null;
  }
};

userSchema.methods.generateJWT = async function () {
  const user = this;

  let payload = {
    id: this._id,
    username: this.username,
    email: this.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  user.tokens = user.tokens.concat({ token });

  return token;
};

userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
