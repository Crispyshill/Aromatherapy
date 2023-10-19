const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.route("")
            .post(userController.createOne);

router.route("/login")
            .post(userController.login);

module.exports = router;