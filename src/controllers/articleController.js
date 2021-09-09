const router = require("express").Router(); 
const { articleModel } = require("../models")

router.get('/all', (req, res) => {
    res.send('This is the all route!')
})

module.exports = router;