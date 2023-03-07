const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 6000, //10imins
  },
});

module.exports = mongoose.model("token", tokenSchema);
