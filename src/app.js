const Express = require("express");
const app = Express();
const cors = require("cors");
const { appPort, dbName } = require("./config/index");

const { sequelize } = require("./db");

const controllers = require("./controllers");

app.use(cors());
app.options("*", cors());
app.use(Express.json());
app.use("/user", controllers.UserController);
app.use("/entry", controllers.EntryController);
app.use("/article", controllers.ArticleController);


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
