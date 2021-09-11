const router = require("express").Router();
const { User } = require("../models");

router.post("/register", async (req, res) => {
  const { email, passwordHash, userName, confirmed, confirmationCode } =
    req.body;
  try {
    const createUser = await User.create({
      userName: userName,
      passwordHash: passwordHash,
      email: email,
      confirmed: confirmed,
      confirmationCode: confirmationCode,
    });
    res.status(200).json({
      email: createUser.email,
      userName: createUser.userName,
    });
  } catch (err) {
    console.log(err);
    if (err instanceof UniqueConstraintError) {
      return res.status(409).json({
        message: "username or display name in use",
      });
    } else {
      return res.status(500).json({
        message: err,
      });
    }
  }
});

module.exports = router;
