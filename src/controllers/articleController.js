const router = require("express").Router();
const validateToken = require("../utils/validateToken");
const { Entry, Article } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/create/:id", validateToken, async (req, res) => {
  let message;
  try {
    let entry = await Entry.findOne({ where: { id: req.params.id } });
    if (entry) {
      console.log("inside conditional");
      let { title, author, description, content, sourceName, publishedAt } = req.body
      let newArticle = await entry.createArticle({
        title: title,
        author: author,
        description: description,
        content: content,
        sourceName: sourceName,
        publishedAt: publishedAt,
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
    if (err instanceof UniqueConstraintError) {
      message = { message: "Post Creation Failed, expected unique entryName" };
    } else {
      message = { message: "Post Creation Failed", err };
    }
  }
  res.json(message);
});

router.get("/all/:EntryId", validateToken, async (req, res) => {
  let message;
  try {
  const articles = await Article.findAll({ where: { EntryId: req.params.EntryId }})
  res.send(articles)
} catch (err) {
  message = { message: "Get article failed", err}
}
})

router.get("/mine/:EntryId/:id", validateToken, async (req, res) => {
  let message;
  const articleId = req.params.id;

  try {
    const article = await Article.findOne({ where: { EntryId: req.params.EntryId, id: articleId } })
    res.send(article);
  } catch (err) {
    message = { message: "Article could not be found", err}
  }
})

router.put("/update/:EntryId/:id", validateToken, async (req, res) => {
  const articleId = req.params.id;
  const EntryId = req.params.EntryId
  const { title, author, description, content, sourceName, publishedAt } = req.body;
  console.log(articleId);
  const query = {
    where: {
      id: articleId,
      EntryId: EntryId
    }
  }

  const data = { title, author, description, content, sourceName, publishedAt }

  let message;
  try {
    const updateArticle = await Article.update(data, query)
    message = {
      message: "Article successfully updated",
      data: updateArticle,
    }
  } catch (err) {
    message = {
      message: "Could not update article", err, 
      data: null,
    }
  }
res.json(message)
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
