const router = require("express").Router();
const { Article } = require("../models");

router.post("/register", async (req, res) => {
  Article.create({
    title: "username created",
  });
});

module.exports = router;
