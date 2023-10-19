const mongoose = require("mongoose");
const Essentialoil = mongoose.model("Essentialoil"); 
require("dotenv").config();

const getAllChemicals = function (req, res) {
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const response = {
        status: process.env.STATUS_OK,
        message: []
    }
    Essentialoil.findById(essentialoilId).select("chemicals").exec().then(function (foundChemicals) {
        response.status = process.env.STATUS_FOUND;
        response.message = foundChemicals;
    })
        .catch(function (err) {
            console.log(err);
            response.status = process.env.STATUS_FIND_ERROR;
            response.message = { message: process.env.MESSAGE_FIND_ERROR };
        })
        .finally(function () {
            res.status(response.status).json(response.message);
        })
}

const _getEssentialoilIdFromRequest = function (req) {
    return req.params.essentialoilId;
}

const createChemical = function (req, res) {
    const response = {
        status: process.env.STATUS_OK,
        message: []
    }
    const essentialoilId = req.params.essentialoilId;
    const newChemical = {
        name: req.body.name,
        category: req.body.category
    }

    Essentialoil.findById(essentialoilId).select("chemicals").exec().then(function (foundChemicals) {
        foundChemicals.chemicals.push(newChemical);
        foundChemicals.save().then(function (savedChemical) {
            response.status = process.env.STATUS_CREATED;
            response.message = savedChemical;
        })
            .catch(function (err) {
                console.log(err);
                if (err._message == process.env.ERROR_ESSENTIALOIL_VALIDATION) {
                    response.status = process.env.STATUS_INVALID_REQUEST;
                    response.message = { error: process.env.MESSAGE_CHEMICAL_VALIDATION_FAILED };
                }
                else {
                    response.status = process.env.STATUS_SAVE_ERROR;
                    response.message = { error: process.env.MESSAGE_SAVE_ERROR };
                }
            })
            .finally(function () {
                res.status(response.status).json(response.message);
            });
        response.status = process.env.STATUS_CREATED;
        response.message = foundChemicals;
    })
        .catch(function (err) {
            console.log(err);
            if (err.reason == process.env.ERROR_BAD_ID_FORMAT) {
                response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
                response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND };
            }
            else {
                response.status = process.env.STATUS_FIND_ERROR;
                response.message = { error: process.env.MESSAGE_FIND_ERROR }
            }
            res.status(response.status).json(response.message);
        });
}

const getOneChemical = function (req, res) {
    const response = {
        status: process.env.STATUS_OK,
        message: []
    }
    const essentialoilId = req.params.essentialoilId;
    const chemicalId = req.params.chemicalId;

    Essentialoil.findById(essentialoilId).select("chemicals").exec().then(function (foundChemicals) {
        console.log(foundChemicals)
        if (null === foundChemicals.chemicals.id(chemicalId)) {
            response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
            response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND + " " + chemicalId };
        }
        else {
            response.status = process.env.STATUS_FOUND;
            response.message = foundChemicals.chemicals.id(chemicalId);
        }
    })
        .catch(function (err) {
            console.log(err);
            if (err.reason == process.env.ERROR_BAD_ID_FORMAT) {
                response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
                response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND };
            }
            else {
                response.status = process.env.STATUS_FIND_ERROR;
                response.message = { error: process.env.MESSAGE_FIND_ERROR };
            }

        })
        .finally(function () {
            res.status(response.status).json(response.message);
        });
}

const deleteOneChemical = function (req, res) {
    const response = {
        status: process.env.STATUS_OK,
        message: []
    }
    const essentialoilId = req.params.essentialoilId;
    const chemicalId = req.params.chemicalId;

    Essentialoil.findById(essentialoilId).select("chemicals").exec().then(function (foundChemicals) {
        if (null === foundChemicals.chemicals.id(chemicalId)) {
            response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
            response.message = { message: process.env.MESSAGE_RESOURCE_NOT_FOUND + " " + chemicalId };
        }
        else {
            const chemicalIndex = foundChemicals.chemicals.indexOf(foundChemicals.chemicals.id(chemicalId));
            foundChemicals.chemicals.splice(chemicalIndex, 1);
            foundChemicals.save().then(function (savedChemicals) {
                response.status = process.env.STATUS_DELETED;
                response.message = savedChemicals;
            })
                .catch(function (err) {
                    console.log(err);
                    response.status = process.env.STATUS_SAVE_ERROR;
                    response.message = { error: process.env.MESSAGE_SAVE_ERROR };
                })
                .finally(function () {
                    res.status(response.status).json(response.message);
                });

        }
    })
        .catch(function (err) {
            console.log(err);
            if (err.reason == process.env.ERROR_BAD_ID_FORMAT) {
                response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
                response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND };
            }
            else {
                response.status = process.env.STATUS_FIND_ERROR;
                response.message = { message: process.env.MESSAGE_FIND_ERROR };
            }
            res.status(response.status).json(response.message);
        });

}



const partialUpdateChemical = function (req, res) {
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const chemicalId = _getChemicalIdFromRequest(req);
    const response = {
        status: process.env.STATUS_OK,
        message: []
    }

    Essentialoil.findById(essentialoilId).select("chemicals").exec().then(function (foundChemicals) {
        if (null === foundChemicals.chemicals.id(chemicalId)) {
            response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
            response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND + " " + chemicalId };
            res.status(response.status).json(response.message);
        }
        else {
            _partiallyFillChemical(foundChemicals, req);
            foundChemicals.save().then(function (savedChemicals) {
                response.status = process.env.STATUS_UPDATED;
                response.message = savedChemicals;
            })
                .catch(function (err) {
                    console.log(err);
                    response.status = process.env.STATUS_SAVE_ERROR;
                    response.message = { error: process.env.MESSAGE_SAVE_ERROR };
                })
                .finally(function () {
                    res.status(response.status).json(response.message);
                })
        }
    })
        .catch(function (err) {
            console.log(err);
            response.status = process.env.STATUS_FIND_ERROR;
            response.message = { error: process.env.MESSAGE_FIND_ERROR };
            res.status(response.status).json(response.message);
        });

}

const fullUpdateChemical = function (req, res) {
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const chemicalId = _getChemicalIdFromRequest(req);
    const response = {
        status: process.env.STATUS_OK,
        message: []
    }

    Essentialoil.findById(essentialoilId).select("chemicals").exec().then(function (foundChemicals) {
        if (null === foundChemicals.chemicals.id(chemicalId)) {
            response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
            response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND + " " + chemicalId };
            res.status(response.status).json(response.message);
        }
        else {
            _fullyFillChemical(foundChemicals, req);
            foundChemicals.save().then(function (savedChemicals) {
                response.status = process.env.STATUS_UPDATED;
                response.message = savedChemicals;
            })
                .catch(function (err) {
                    console.log(err);
                    if (err.reason == process.env.ERROR_BAD_ID_FORMAT) {
                        response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
                        response.message = { error: process.env.MESSAGE_RESOURCE_NOT_FOUND };
                    }
                    else {
                        response.status = process.env.STATUS_SAVE_ERROR;
                        response.message = { error: process.env.MESSAGE_SAVE_ERROR };
                    }
                })
                .finally(function () {
                    res.status(response.status).json(response.message);
                })
        }
    })
        .catch(function (err) {
            console.log(err);
            response.status = process.env.STATUS_FIND_ERROR;
            response.message = { error: process.env.MESSAGE_FIND_ERROR };
            res.status(response.status).json(response.message);
        });
}

const _getChemicalIdFromRequest = function (req) {
    return req.params.chemicalId;
}

const _fullyFillChemical = function (foundChemicals, req) {
    const chemicalId = _getChemicalIdFromRequest(req);
    foundChemicals.chemicals.id(chemicalId).name = req.body.name;
    foundChemicals.chemicals.id(chemicalId).category = req.body.category;
}

const _partiallyFillChemical = function (foundChemicals, req) {
    const chemicalId = _getChemicalIdFromRequest(req);
    if (req.body.name) {
        foundChemicals.chemicals.id(chemicalId).name = req.body.name;
    }
    if (req.body.category) {
        foundChemicals.chemicals.id(chemicalId).category = req.body.category;
    }
}



module.exports = {
    getAllChemicals,
    createChemical,
    getOneChemical,
    deleteOneChemical,
    fullUpdateChemical,
    partialUpdateChemical
}