const Express = require("express");
const app = Express();
const { appPort, dbName } = require("./config/index")

const dbConnection = require("./db/index");

const controllers = require("./controllers")

app.use(Express.json())

app.use('/articles', controllers.ArticleController)
app.use('/users', controllers.UserController)

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    console.log(`connected to database ${dbName}`);
  app.listen(appPort, () =>
    console.log(`[Server]: App is listening on 3001`))  
})
.catch((err) => console.log(`${err}`))
