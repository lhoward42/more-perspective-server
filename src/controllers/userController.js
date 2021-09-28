const bcrypt = require("bcryptjs");
const router = require("express").Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { jwtSecret } = require("../config");

router.post("/register", async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    const createUser = await User.create({
      userName: userName,
      passwordHash: bcrypt.hashSync(password, 12),
      email: email,
    });

    const confirmToken = jwt.sign({ email: email, id: createUser.id }, jwtSecret);

    res.status(200).json({
      email: createUser.email,
      userName: createUser.userName,
      confirmationToken: confirmToken,
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (findUser) {
      const comparePassword = bcrypt.compare(
        password,
        findUser.passwordHash
      );

      if (comparePassword) {
        const token = jwt.sign({ id: findUser.id }, jwtSecret, {
          expiresIn: "24h",
        });
        console.log(`login successful for ${findUser.userName}`);
        res.status(200).json({
          email: findUser.email,
          userName: findUser.userName,
          sessionToken: token,
        });
      }
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;