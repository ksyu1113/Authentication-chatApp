const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  chatroom: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "chatRoom",
  },
  username: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "username",
  },
});

module.exports = mongoose.model("message", messageSchema);
