const router = require("express").Router();
const chemicalController = require("../controllers/chemical.controller");
const authenticationController = require("../controllers/authentication.controller");
require("dotenv").config();

router.route("/:essentialoilId" + process.env.PATH_CHEMICALS)
            .get(chemicalController.getAllChemicals)
            .post(authenticationController.authenticate, chemicalController.createChemical);

router.route("/:essentialoilId" + process.env.PATH_CHEMICALS + "/:chemicalId")
            .get(chemicalController.getOneChemical)
            .delete(authenticationController.authenticate, chemicalController.deleteOneChemical)
            .put(authenticationController.authenticate, chemicalController.fullUpdateChemical)
            .patch(authenticationController.authenticate, chemicalController.partialUpdateChemical);

module.exports = router;
