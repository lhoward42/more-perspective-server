const router = require("express").Router();
const validateToken = require("../utils/validateToken");
const jwt = require("jsonwebtoken");
const { Entry, User } = require("../models");
const { jwtSecret } = require("../config");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.get("/all/:id", validateToken, async (req, res) => {
  let u = await User.findOne({ where: { id: req.params.id } });
  let entries = u ? await u.getEntries() : null;
  if (entries) {
    let cleaned_entries = entries.map((e) => {
      const { id, entryName, articleTitles, contents, sources, images } = e;
      return { id, entryName, articleTitles, contents, sources, images };
    });
    res.send(cleaned_entries);
  } else res.send(entries);
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

// router.put("/:id", validateToken, async (req, res, next) => {
//   let message;
//   try{
//   let u = await User.findOne({ where: { id: req.user.id } });
//   let entry = u
//     ? await Entry.findOne({ where: { EntryId: req.params.id } })
//     : null;
//   if (entry) {
//     let updateEntry = await Entry.update(
//       {
//         entryName: req.body.entryName,
//         articleTitles: req.body.articleTitles,
//         contents: req.body.contents,
//         sources: req.body.sources,
//         images: req.body.images,
//       },
//       entry
//     );
//     await u.setEntry(updateEntry);
//     message = {
//       message: "Entry made",
//       data: newEntry,
//     };
//   } else {
//     message = {
//       message: "Can't update post",
//       data: null,
//     };
//   }
// } catch (err) {
//   message = {
//     message: "User does not exist"
//   }
// }
// });

router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.user;
  const entryId = req.params.id;
  const { entryName, articleTitles, contents, sources, images } = req.body;
  let message;
  
  console.log(id);
  try {
    // const u = await User.findOne({ where: { id: req.user.id } });
    // console.log(u);
    // const entryId = u
    //   ? await Entry.findOne({ where: { EntryId: req.params.id } })
    //   : null;

    // const query = { where: { id: entryId, UserId: u }, returning: true };

    // const data = {
    //   entryName,
    //   articleTitles,
    //   contents,
    //   sources,
    //   images,
    // };
    console.log("THIS IS DATA", data);
    // if (entryId) {
    let data;
    const updateEntry = await Entry.update(
      (data = {
        entryName: entryName,
        articleTitles: articleTitles,
        contents: contents,
        sources: sources,
        images: images,
      }
      ),
      { where: { id: entryId } }
    ); 
    console.log(data);
    await u.setEntry(updateEntry);
    console.log(updateEntry);
    //   message = {
    //     message: "Entry updated",
    //     data: updateEntry,
    //   };
    // } else {
    //   message = {
    //     message: "Can't make an update",
    //     data: null,
    //   };
    // }
  } catch (err) {
    message = {
      message: "Entry is not updated",
    };
  }
  res.json(message);
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
