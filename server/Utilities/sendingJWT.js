const sendingJWT = (user, res) => {
  try {
    const generatedToken = user.generateJWT();

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("authorization", generatedToken, options);
  } catch (err) {
    console.log(err.name);
    console.log(err.message);
    console.log("JWT failure");
  }
};

module.exports = sendingJWT;
