
require("dotenv").config();
const app = require("./app");
const port = 3001;
const connectDB = require("./database/database");

connectDB();

const message = require("./models/messageModel");
const chatRoom = require("./models/chatRoomModel");
const user = require("./models/userModel");


app.listen(port, () => {
  console.log(`...server running on port ${port}`);
});
