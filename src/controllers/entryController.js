const router = require("express").Router();
const validateToken = require("../utils/validateToken");
const { Entry, User } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");

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

router.get("/mine", validateToken, async (req, res) => {
  const { id } = req.user;
  let message;
  try {
    const entries = await Entry.findAll({ where: { UserId: id } });
    res.send(entries);
  } catch (err) {
    message = { message: "Entries could not be found", err };
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
    message = { message: "Entry could not be found", err };
  }
});

router.put("/update/:id", validateToken, async (req, res) => {
  const entryId = req.params.id;
  const { entryName, articleTitles, contents, sources, images } = req.body;

  const query = {
    where: {
      id: entryId,
    },
    returning: true,
  };

  const data = { entryName, articleTitles, contents, sources, images };

  let message;
  try {
    const updateEntry = await Entry.update(data, query);
    message = {
      message: "Entry successfully updated",
      data: updateEntry,
    };
  } catch (err) {
    message = {
      message: "Could not update entry",
      data: null,
    };
  }
  res.json(message)
});

router.delete("/delete/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;
  let message;
  try {
    const response = await Entry.destroy({
      where: {
        id: entryId,
        UserId: id,
      },
    });
    console.log(response);
    message = { message: "success" };
  } catch (err) {
    message = { message: "Failed to Delete " };
  }
  res.json(message);
});

module.exports = router;
