const Express = require("express");
const app = Express();

const controllers = require("./controllers")

app.use('/articles', controllers.articlesController)
app.use('/users', controllers.userController)

app.listen(3000, () => {
    console.log(`[Server]: App is listening on 3000`);
})