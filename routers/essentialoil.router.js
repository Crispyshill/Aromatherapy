const router = require("express").Router();
const EOController = require("../controllers/essentialoil.controller");
const authenticationController = require("../controllers/authentication.controller");

router.route("/")
        .get(EOController.getAllEssentialoils)
        .post(authenticationController.authenticate, EOController.createEssentialoil);

router.route("/:id")
        .get(EOController.getOneEssentialoil)
        .delete(authenticationController.authenticate, EOController.deleteOneEssentialoil)
        .patch(authenticationController.authenticate, EOController.partialUpdateEssentialoil)
        .put(authenticationController.authenticate, EOController.fullUpdateEssentialoil);

module.exports = router;