const router = require("express").Router();
const { UserModel } = require("../models")

router.post("/register", async (req, res) => {
        UserModel.create({
            userName: "username created",
            passwordHash: "something",
            email: "email created",
            confirmed: false,
            confirmationCode,
            

        })
    })


module.exports = router;