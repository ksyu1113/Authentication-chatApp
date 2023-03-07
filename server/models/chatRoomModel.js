const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatRoomSchema = new Schema({
  roomname: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("chatRoom", chatRoomSchema);
