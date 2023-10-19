const mongoose = require("mongoose");
const Essentialoil = mongoose.model("Essentialoil");
require("dotenv").config();
const getAllValidator = require("../validation/getAll.validation");


const createEssentialoil = function (req, res) {
    const response = _createResponse();
    const newEssentialoil = _getEssentialoilFromRequest(req);
    _createEssentialOilInDatabase(newEssentialoil)
        .then((createdEssentialoil) => _fillResponse(process.env.STATUS_CREATED, createdEssentialoil, response))
        .catch((err) => _fillCreateEssentialoilErrorResponse(err, response))
        .finally(() => _sendResponse(response, res));
}

const getAllEssentialoils = function (req, res) {

    let count = _getCountFromRequest(req);
    const offset = _getOffsetFromRequest(req);
    const response = _createResponse(res);

    if (!getAllValidator.isValidCount(count)) {
        _fillResponseWithInvalidCountError(response);
        _sendResponse(response, res);
    }
    else if (!getAllValidator.isValidOffset(offset)) {
        _fillResponseWithInvalidOffsetError(response);
        _sendResponse(response, res);
    }
    else if (parseInt(count, process.env.NUMBER_BASE) > process.env.MAX_COUNT) {
        _fillResponseWithCountTooLargeError(response);
        _sendResponse(response, res);
    }
    else {
        if (null == count) {
            count = process.env.DEFAULT_COUNT;
        }

        _findAllEssentialoils(count, offset)
            .catch((err) => _fillResponseWithFindError(err, response))
            .then((foundEssentialoils) => _fillResponseWithFoundEssentialoil(foundEssentialoils, response))
            .finally(() => _sendResponse(response, res));
    }
}

const getOneEssentialoil = function (req, res) {
    const response = _createResponse();
    const essentialoilId = _getIdFromRequest(req);

    _findEssentialoilById(essentialoilId)
        .catch((err) => _fillResponseWithFindError(err, response))
        .then((findEssentialoilResult) => _ensureFoundEssentialoilIsNotNull(findEssentialoilResult))
        .catch((err) => _fillResponseWithResourceNotFoundError(err, response))
        .then((foundEssentialoil) => _fillResponseWithFoundEssentialoil(foundEssentialoil, response))
        .finally(() => _sendResponse(response, res));
}

const partialUpdateEssentialoil = function (req, res) {
    _updateEssentialoil(req, res, _partialFillEssentialOil)
}

const fullUpdateEssentialoil = function (req, res) {
    _updateEssentialoil(req, res, _fullyFillEssentialoil);
}

const deleteOneEssentialoil = function (req, res) {
    console.log("calling delete on backend");
    const id = _getIdFromRequest(req);
    const response = _createResponse();

    Essentialoil.deleteOne({ "_id": id })
        .catch((err) => _fillResponseWithDeleteError(err, response))
        .then((acknowledgement) => _ensureEssentialoilDeleted(acknowledgement))
        .catch((err) => _fillResponseWithResourceNotFoundError(err, response))
        .then((acknowledgement) => _fillResponseWithDeleteAcknowledgement(acknowledgement, response))
        .finally(() => _sendResponse(response, res));
}

const _fillResponseWithInvalidCountError = function (response) {
    _fillResponse(process.env.STATUS_INVALID_REQUEST, { "error": process.env.MESSAGE_INVALID_COUNT }, response);
}

const _fillResponseWithInvalidOffsetError = function (response) {
    _fillResponse(process.env.STATUS_INVALID_REQUEST, { "error": process.env.MESSAGE_INVALID_OFFSET }, response);
}

const _fillResponseWithCountTooLargeError = function (response) {
    _fillResponse(process.env.STATUS_INVALID_REQUEST, { "error": process.env.MESSAGE_COUNT_GREATER_THAN_MAX + " " + process.env.MAX_COUNT }, response);
}

const _findAllEssentialoils = function (count, offset) {
    return Essentialoil.find().skip(offset).limit(count).exec();
}

const _fillResponse = function (status, message, response) {
    response.status = status;
    response.message = message;
}

const _fillCreateEssentialoilErrorResponse = function (err, response) {

    console.log(err);

    if (err._message == process.env.ERROR_ESSENTIALOIL_VALIDATION) {
        _fillResponse(process.env.STATUS_INVALID_REQUEST, { error: process.env.MESSAGE_ESSENTIALOIL_VALIDATION_FAILED }, response);
    }
    else {
        _fillResponse(process.env.STATUS_CREATE_ERROR, { error: process.env.MESSAGE_CREATE_ERROR }, response);
    }
}

const _sendResponse = function (response, res) {
    res.status(response.status).json(response.message);
}

const _createResponse = function () {
    return {
        status: process.env.STATUS_OK,
        message: []
    };
}

const _createEssentialOilInDatabase = function (newEssentialoil) {
    return Essentialoil.create(newEssentialoil);
}

const _fillResponseWithResourceNotFoundError = function (err, response) {
    console.log(err);
    _fillResponse(process.env.STATUS_RESOURCE_NOT_FOUND, { "message": process.env.MESSAGE_RESOURCE_NOT_FOUND }, response);
}

const _fillResponseWithFindError = function (err, response) {
    console.log(err);
    _fillResponse(response.status = process.env.STATUS_FIND_ERROR, { error: process.env.MESSAGE_FIND_ERROR }, response);
}

const _findEssentialoilById = function (id) {
    return Essentialoil.findById(id);
}

const _fillResponseWithFoundEssentialoil = function (foundEssentialoil, response) {
    _fillResponse(process.env.STATUS_FOUND, foundEssentialoil, response);
}

const _ensureFoundEssentialoilIsNotNull = function (foundEssentialoil) {
    return new Promise((resolve, reject) => {
        if (null === foundEssentialoil) {
            reject();
        }
        else {
            resolve(foundEssentialoil);
        }
    });
}

const _updateEssentialoil = function (req, res, _fillEssentialoil) {
    const response = _createResponse();
    const essentialoilId = _getIdFromRequest(req);

    _findEssentialoilById(essentialoilId)
        .catch((err) => _fillResponseWithFindError(err))
        .then((findEssentialoilResult) => _ensureFoundEssentialoilIsNotNull(findEssentialoilResult))
        .catch((err) => _fillResponseWithResourceNotFoundError(err, response))
        .then((foundEssentialoil) => _fillEssentialOil(foundEssentialoil, req))
        .then((filledEssentialoil) => _saveEssentialoil(filledEssentialoil))
        .catch((err) => _fillResponseWithSaveError(err))
        .then((savedEssentialoil) => _fillResponseWithUpdatedEssentialoil(savedEssentialoil, response))
        .catch((err) => _fillResponseWithSaveError(err, response))
        .finally(() => _sendResponse(response, res));
}

const _fillResponseWithUpdatedEssentialoil = function (updatedEssentialoil, response) {
    _fillResponse(process.env.STATUS_UPDATED, updatedEssentialoil, response);
}

const _fillResponseWithSaveError = function (err, response) {
    console.log(err);
    if (err._message == process.env.ERROR_ESSENTIALOIL_VALIDATION) {
        _fillResponse(process.env.STATUS_INVALID_REQUEST, { "error": process.env.MESSAGE_ESSENTIALOIL_VALIDATION_FAILED }, response);
    }
    else {
        _fillResponse(process.env.STATUS_SAVE_ERROR, { "error": process.env.MESSAGE_SAVE_ERROR }, response);
    }
}

const _saveEssentialoil = function (essentialoil) {
    return essentialoil.save();
}

const _ensureEssentialoilDeleted = function (acknowledgement) {
    return new Promise((resolve, reject) => {
        if (acknowledgement.deletedCount < process.env.MIN_DELETE) {
            reject();
        }
        else {
            resolve(acknowledgement);
        }
    });
}

const _fillResponseWithDeleteError = function (err, response) {
    console.log(err);
    if (err.reason == process.env.ERROR_BAD_ID_FORMAT) {
        _fillResponse(process.env.STATUS_RESOURCE_NOT_FOUND, { error: process.env.MESSAGE_RESOURCE_NOT_FOUND }, response);
    }
    else {
        _fillResponse(process.env.STATUS_DELETE_ERROR, { "error": process.env.MESSAGE_DELETE_ERROR }, response);
    }
}

const _fillResponseWithDeleteAcknowledgement = function (acknowledgement, response) {
    _fillResponse(process.env.STATUS_DELETED, acknowledgement, response);
}

const _partialFillEssentialOil = function (foundEssentialoil, req) {
    if (req.body.modernName) {
        foundEssentialoil.modernName = req.body.modernName;
    }
    if (req.body.latinName) {
        foundEssentialoil.latinName = req.body.latinName;
    }
    if (req.body.balancedDoshas) {
        foundEssentialoil.balancedDoshas = req.body.balancedDoshas;
    }
    if (req.body.chemicals) {
        foundEssentialoil.chemicals = req.body.chemicals;
    }
    return new Promise((resolve) => {
        resolve(foundEssentialoil);
    });
}

const _fullyFillEssentialoil = function (foundEssentialoil, req) {
    foundEssentialoil.modernName = req.body.modernName;
    foundEssentialoil.latinName = req.body.latinName;
    foundEssentialoil.balancedDoshas = req.body.balancedDoshas;
    foundEssentialoil.chemicals = req.body.chemicals;
    return new Promise((resolve) => {
        resolve(foundEssentialoil);
    });
}


const _getIdFromRequest = function (req) {
    return req.params.id;
}

const _getCountFromRequest = function (req) {
    return req.query.count;
}
const _getOffsetFromRequest = function (req) {
    return req.query.offset;
}

const _getEssentialoilFromRequest = function (req) {
    return {
        modernName: req.body.modernName,
        latinName: req.body.latinName,
        balancedDoshas: req.body.balancedDoshas,
        chemicals: req.body.chemicals
    }
}

module.exports = {
    getAllEssentialoils,
    getOneEssentialoil,
    createEssentialoil,
    deleteOneEssentialoil,
    partialUpdateEssentialoil,
    fullUpdateEssentialoil
}