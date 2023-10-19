const router = require("express").Router();
const EOController = require("../controllers/essentialoil.controller");

router.route("/")
        .get(EOController.getAllEssentialoils)
        .post(EOController.createEssentialoil);

router.route("/:id")
        .get(EOController.getOneEssentialoil)
        .delete(EOController.deleteOneEssentialoil)
        .patch(EOController.partialUpdateEssentialoil)
        .put(EOController.fullUpdateEssentialoil);

module.exports = router;