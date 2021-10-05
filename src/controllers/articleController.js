const router = require("express").Router();
const validateToken = require("../utils/validateToken");
const { Entry, Article } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/create/:id", validateToken, async (req, res) => {
  let message;
  try {
    let entry = await Entry.findOne({ where: { id: req.params.id } });
    if (entry) {
      
      let { title, author, description, content, sourceName, publishedAt, image, url } = req.body
      let newArticle = await entry.createArticle({
        title: title,
        author: author,
        description: description,
        content: content,
        sourceName: sourceName,
        image: image,
        publishedAt: publishedAt,
        url: url
      });
      console.log(newArticle);
      await entry.addArticle(newArticle);
      message = {
        message: "article made",
        data: newArticle,
      };
    } else {
      message = {
        message: "article could not be made",
        data: null,
      };
    }
  } catch (err) {
    
      message = { message: "Post Creation Failed", err };
    
  }
  res.json(message);
});


router.get("/:EntryId/:id", validateToken, async (req, res) => {
  let message;
  const articleId = req.params.id;

  try {
    const article = await Article.findOne({ where: { EntryId: req.params.EntryId, id: articleId } })
    res.send(article);
  } catch (err) {
    message = { message: "Article could not be found", err}
  }
})

router.get("/:EntryId", validateToken, async (req, res) => {
  let message;
  const { EntryId } = req.params

  try {
    const article = await Article.findAll({ where: { EntryId: EntryId } })
    res.send(article);
  } catch (err) {
    message = { message: "Article could not be found", err}
  }
})

router.delete("/delete/:EntryId/:id", validateToken, async (req, res) => {
  const articleId = req.params.id;
  const EntryId = req.params.EntryId
  let message;
  try {
    const response = await Article.destroy({
      where: {
        id: articleId,
        EntryId: EntryId
      }
    })
    console.log(response);
    message = { message: "success"}
  } catch (err) {
    message = { message: "Failed to Delete", err}
  }
  
  res.json(message)
})

module.exports = router;
