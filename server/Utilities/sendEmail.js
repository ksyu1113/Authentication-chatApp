const nodemailer = require("nodemailer");

const sendingOut = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: process.env.MAILPORT,
      secure: true,
      auth: {
        user: process.env.GMAILACC,
        pass: process.env.GMAILPW,
      },
    });

    const message = `Please reset your password by clicking below link: \n${link} \n
    please contact us if you have not made such request`;

    await transporter.sendMail({
      from: process.env.GMAILACC,
      to: email,
      subject: "Password recovery",
      text: message,
    });

    console.log(`email has been sent to ${email}`);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = sendingOut;
