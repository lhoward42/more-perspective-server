const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwtSecret } = require("../config");

const validateToken = async (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer")
      ) {
        const { authorization } = req.headers;
        const payload = authorization
          ? jwt.verify(
              authorization.includes("Bearer")
                ? authorization.split(" ")[1]
                : authorization,
              jwtSecret
            )
          : undefined;
        console.log(payload);

        if (payload) {
          let getUser = await User.findOne({
            where: { id: payload.id },
          });
          if (getUser) {
            console.log(getUser.id);
            req.user.id = getUser.id;
            next();
          } else {
            res.status(400).send({ message: " Not Authorized" });
          }
        } else {
          res.status(401).send({ message: "Invalid token" });
        }
      } else {
        res.status(403).send({ message: "forbidden" });
      }
    } catch (err) {
      res.status(500).send({ message: "validate failed" });
    }
  }
};

module.exports = validateToken;
