const router = require("express").Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const chatroom = require("../models/chatRoomModel");


router.get("/test", (req, res) => {
  console.log("...chatroom test success");
});

router.post("/create", auth, async (req, res) => {
  try {
    const { roomname } = req.body;

    const foundOne = await chatroom.findOne({ roomname });

    if (foundOne)
      return res.status(400).json({ message: "chatroom already exist" });

    if(!foundOne);
    const newChatroom = new chatroom({
      roomname,
    });
    await newChatroom.save();
    res.json({ message: "chatroom created" });
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    res.json({ message: "chatroom route failure" });
  }
});

module.exports = router;
