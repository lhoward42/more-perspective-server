const router = require("express").Router();
const validateToken = require("../utils/validateToken");
const jwt = require("jsonwebtoken");
const { Entry, User } = require("../models");
const { jwtSecret } = require("../config");

router.get("/all/:id", validateToken, async (req, res) => {
  let u = await User.findOne({ where: { id: req.params.id } });
  let entries = u ? await u.getPosts() : null;
  if (entries) {
    let cleaned_entries = entries.map((e) => {
      const { id, entryName, articleTitles, contents, sources, images } = e;
      return { id, entryName, articleTitles, contents, sources, images };
    });
    res.send(cleaned_entries);
  } else res.send(entries);
});

// router.get("/:id", async (req, res) => {
//   const { id } = req.user;
//   const entryId = req.params.id;

//   try {
//     const getEntry = await Entry.findOne({
//       where: {
//         id: entryId,
//         userId: id,
//       },
//     });

//     if (getEntry) {
//       res.status(200).json({
//         data: getEntry,
//       });
//     } else {
//       res.status(400).json({
//         message: "bad request",
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: err,
//     });
//   }
// });

router.post("/create", validateToken, async (req, res) => {
  let message;
  console.log("in create route");
  try {
    let u = await User.findOne({ where: { id: req.user.id } });
    console.log(u);
    if (u) {
      let newEntry = await Entry.create({
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
    message = { message: "Post Creation Failed" };
  }
  res.json(message);
});

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;
  const { entryName } = req.body;

  const query = {
    where: {
      id: entryId,
      userId: id,
    },
    returning: true,
  };

  const data = {
    entryName,
  };

  try {
    const updateEntry = await Entry.update(data, query);

    if (updateEntry[0] === 1) {
      res.status(200).json({
        data: updateEntry,
      });
    } else {
      res.status(400).json({
        message: "bad request",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;

  try {
    let message;
    Entry.destroy({
      where: {
        id: entryId,
        UserId: id,
      },
    });
    message = { message: "success" };
  } catch (err) {
    message = { message: "Failed to Update " };
  }
});

module.exports = router;
