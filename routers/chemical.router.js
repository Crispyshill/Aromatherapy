const router = require("express").Router();
const chemicalController = require("../controllers/chemical.controller");
require("dotenv").config();

router.route("/:essentialoilId" + process.env.PATH_CHEMICALS)
            .get(chemicalController.getAllChemicals)
            .post(chemicalController.createChemical);

router.route("/:essentialoilId" + process.env.PATH_CHEMICALS + "/:chemicalId")
            .get(chemicalController.getOneChemical)
            .delete(chemicalController.deleteOneChemical)
            .put(chemicalController.fullUpdateChemical)
            .patch(chemicalController.partialUpdateChemical);

module.exports = router;
