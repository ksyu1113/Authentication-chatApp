const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

const userRoute = require("./routes/userRoute");
app.use("/user", userRoute);

const chatroomRoute = require("./routes/chatroomRoute");
app.use("/chatroom", chatroomRoute);

module.exports = app;
