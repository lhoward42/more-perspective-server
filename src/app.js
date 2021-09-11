const Express = require("express");
const app = Express();
const { appPort, dbName } = require("./config/index");

const { sequelize } = require("./db");

const controllers = require("./controllers");
app.use(Express.json());

app.use("/users", controllers.UserController);
app.use("/articles", controllers.ArticleController);
// app.use("/entry", controllers.EntryController);

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    console.log(`connected to database ${dbName}`);
    app.listen(appPort, () => console.log(`listening on port ${appPort}`));
  })
  .catch((err) => {
    console.log(`${err}`);
  });
