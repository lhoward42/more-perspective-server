const router = require("express").Router();
const validateToken = require("../utils/validateToken");
const { Entry, User } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.get("/mine", validateToken, async (req, res) => {
  const { id } = req.user;
  let message;
  try {
    const entries = await Entry.findAll({ where: { UserId: id } });
    console.log(entries);
    res.send(entries);
  } catch (err) {
    message = { message: "Can't grab entries" };
  }
});

router.get("/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;

  let message;
  try {
    const entry = await Entry.findOne({ where: { UserId: id, id: entryId } });
    res.send(entry);
  } catch (err) {
    message = { message: "Can't grab entry" };
  }
});

router.post("/create", validateToken, async (req, res) => {
  let message;
  try {
    let u = await User.findOne({ where: { id: req.user.id } });
    if (u) {
      let newEntry = await u.createEntry({
        entryName: req.body.entryName,
        articleTitles: req.body.articleTitles,
        contents: req.body.contents,
        sources: req.body.sources,
        images: req.body.images,
      });
      await u.addEntry(newEntry);

      message = {
        message: "Entry made",
        data: newEntry,
      };
    } else {
      message = {
        message: "Can't make a post, user does not exist",
        data: null,
      };
    }
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      message = { message: "Post Creation Failed, expected unique entryName" };
    } else {
      message = { message: "Post Creation Failed" };
    }
  }
  res.json(message);
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;
  console.log(entryId);
  const { entryName, articleTitles, contents, sources, images } = req.body;
  let message;
});

router.delete("/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;
  let message;
  try {
    Entry.destroy({
      where: {
        id: entryId,
        UserId: id,
      },
    });
    message = { message: "success" };
  } catch (err) {
    message = { message: "Failed to Delete " };
  }
  res.json(message);
});

module.exports = router;
