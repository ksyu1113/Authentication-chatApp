const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_CONNECTION, {
      useNewUrlParser: true, //current URL字串解析器被棄用 但mongoose也提供了解決方案
      useUnifiedTopology: true, //current 服務器 和 監視引擎已被棄用 但mongoose也提供了解決方案
    });
    console.log("...MongoDB connected");
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
    return res.json({message:"database connection fail"})
  }
};

module.exports = connectDB;
