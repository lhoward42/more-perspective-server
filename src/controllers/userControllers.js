const Express = require("express");
const router = Express.Router();

router.get('/all', (req, res) => {
    res.send('This is the all route!')
})

module.exports = router;