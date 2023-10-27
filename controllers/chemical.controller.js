const mongoose = require("mongoose");
const Essentialoil = mongoose.model("Essentialoil");
require("dotenv").config();

const getAllChemicals = function (req, res) {
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const response = _createResponse();

    const count = _getCountFromRequest(req);
    const offset = _getOffsetFromRequest(req);



    _findChemicals(essentialoilId)
        .then((foundChemicals) => _applyOffsetToChemicalList(foundChemicals, offset))
        .then((offsetChemicals) => _applyCountToChemicalList(offsetChemicals, count))
        .then((adjustedChemicals) => _fillResponseWithFoundChemicals(adjustedChemicals, response))
        .catch((err) => _fillResponseWithGetAllError(err, response))
        .finally(() => _sendResponse(res, response))
}

const _applyOffsetToChemicalList = function (chemicalList, offset) {
    return new Promise((resolve, reject) => {
        if(undefined === offset){
            offset = 0;
        }
        if(isNaN(parseInt(offset, process.env.NUMBER_BASE))){
            reject(process.env.MESSAGE_INVALID_OFFSET);
        }
        else if (parseInt(offset, process.env.NUMBER_BASE) < 0) {
            reject(process.env.MESSAGE_INVALID_OFFSET);
        } else {
            resolve(chemicalList.chemicals.slice(parseInt(offset, process.env.NUMBER_BASE)));
        }
    });
}

const _applyCountToChemicalList = function (chemicalList, count) {
    return new Promise((resolve, reject) => {
        if(undefined === count){
            count = process.env.DEFAULT_COUNT;
        }
        if(isNaN(parseInt(count, process.env.NUMBER_BASE))){
            reject(process.env.MESSAGE_INVALID_COUNT);
        }
        else if (parseInt(count, process.env.NUMBER_BASE) < 0) {
            reject(process.env.MESSAGE_INVALID_COUNT);
        } else if (parseInt(count, process.env.NUMBER_BASE) > process.env.MAX_COUNT) {
            reject(process.env.MESSAGE_COUNT_GREATER_THAN_MAX);
        } else {
            resolve(chemicalList.slice(0, parseInt(count, process.env.NUMBER_BASE)));
        }
    });
}


const _getCountFromRequest = function (req) {
    return req.query.count;
}

const _getOffsetFromRequest = function (req) {
    return req.query.offset;
}

const _findChemicals = function (essentialoilId) {
    return Essentialoil.findById(essentialoilId).select("chemicals").exec();
}

const _fillResponseWithFoundChemicals = function (foundChemicals, response) {
    response.status = process.env.STATUS_FOUND;
    response.message = foundChemicals;
}

const _fillResponseWithGetAllError = function (err, response) {
    console.log("find all error", err);
    if(err === process.env.MESSAGE_INVALID_OFFSET){
        response.status = process.env.STATUS_INVALID_REQUEST;
        response.message = {"message": err}
    }
    else if(err === process.env.MESSAGE_INVALID_COUNT){
        response.status = process.env.STATUS_INVALID_REQUEST;
        response.message = {"message": err}
    }
    else if(err === process.env.MESSAGE_COUNT_GREATER_THAN_MAX){
        response.status = process.env.STATUS_INVALID_REQUEST;
        response.message = {"message": err + " " + process.env.MAX_COUNT}
    }
    else{
    response.status = process.env.STATUS_FIND_ERROR;
    response.message = { "message": process.env.MESSAGE_FIND_ERROR }
    }
}

const _sendResponse = function (res, response) {
    res.status(response.status).json(response.message);
}


const _createResponse = function () {
    return {
        status: process.env.STATUS_OK,
        message: []
    }
}
const _getEssentialoilIdFromRequest = function (req) {
    return req.params.essentialoilId;
}


const _createChemicalFromRequest = function (req) {
    return {
        name: req.body.name,
        category: req.body.category
    }
}

const _addNewChemicalToChemicals = function (newChemical, chemicals) {
    console.log("Chemical list adding", chemicals)
    return new Promise((resolve, reject) => {
        if(null ===chemicals){
            reject(process.env.MESSAGE_RESOURCE_NOT_FOUND);
        }
        else{
        chemicals.chemicals.push(newChemical);
        resolve(chemicals);
        }
    })
}

const _saveChemicalList = function (chemicals) {
    console.log("Saving chemicals", chemicals)
    return chemicals.save();
}

const createChemical = function (req, res) {
    const response = _createResponse();
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const newChemical = _createChemicalFromRequest(req);

    _findChemicals(essentialoilId)
        .then((foundChemicals) => _addNewChemicalToChemicals(newChemical, foundChemicals))
        .then((updatedChemicalList) => _saveChemicalList(updatedChemicalList))
        .catch((err) => _fillResponseWithCreationError(err, response))
        .finally(() => _sendResponse(res, response));
}

const _fillResponseWithCreationError = function (err, response) {
    console.log("Create error", err, "End Create error");
    console.log("Message", err._message)
    if(err === process.env.MESSAGE_RESOURCE_NOT_FOUND){
        response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
        response.message = {"message": err}
    }
    else if(err._message == process.env.ERROR_ESSENTIALOIL_VALIDATION){
        response.status = process.env.STATUS_INVALID_REQUEST;
        response.message = {"message": process.env.MESSAGE_CHEMICAL_VALIDATION_FAILED}
    }
    else{
    response.status = 500;
    response.message = { "message": process.env.MESSAGE_CREATE_ERROR }
    }
}

const getOneChemical = function (req, res) {
    const response = _createResponse();
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const chemicalId = _getChemicalIdFromRequest(req);

    _findChemicals(essentialoilId)
        .then((foundChemicals) => _checkForSpecificChemical(foundChemicals, chemicalId))
        .then((foundChemical) => _fillResponseWithFoundChemicals(foundChemical, response))
        .catch((err) => _fillResponseWithGetOneError(err, response))
        .finally(() => _sendResponse(res, response));
}


const _fillResponseWithGetOneError = function (err, response) {
    console.log("Get one error", err);
    if(err === process.env.MESSAGE_RESOURCE_NOT_FOUND){
        response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
        response.message = {"message": process.env.MESSAGE_RESOURCE_NOT_FOUND}
    }
    else{
    response.status = process.env.STATUS_FIND_ERROR;
    response.message = { "message": process.env.MESSAGE_FIND_ERROR }
    }
}

const _checkForSpecificChemical = function (chemicalList, chemicalId) {
    return new Promise((resolve, reject) => {
        if (null === chemicalList.chemicals.id(chemicalId)) {
            reject(process.env.MESSAGE_RESOURCE_NOT_FOUND);
        }
        else {
            resolve(chemicalList.chemicals.id(chemicalId));
        }
    })
}

const deleteOneChemical = function (req, res) {
    const response = _createResponse();
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const chemicalId = _getChemicalIdFromRequest(req);

    _findChemicals(essentialoilId)
        .then((foundChemicals) => _deleteChemicalFromList(foundChemicals, chemicalId))
        .then((updatedChemicalList) => _saveChemicalList(updatedChemicalList))
        .then((savedChemicals) => _fillResponseWithSavedChemicals(savedChemicals, response))
        .catch((err) => _fillResponseWithDeleteError(err, response))
        .finally(() => _sendResponse(res, response));
}

const _fillResponseWithDeleteError = function (err, response) {
    console.log("Delete error", err);
    if(err === process.env.MESSAGE_FIND_ERROR){
        response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
        response.message = {"message": process.env.MESSAGE_RESOURCE_NOT_FOUND}
    }
    else{
    response.status = process.env.STATUS_DELETE_ERROR;
    response.message = { "message": process.env.MESSAGE_DELETE_ERROR };
    }
}

const _fillResponseWithSavedChemicals = function (savedChemicals, response) {
    response.status = process.env.STATUS_DELETED;
    response.message = savedChemicals;
}


const _deleteChemicalFromList = function (chemicalList, chemicalId) {
    let chemicalIndex = 0;
    return new Promise((resolve, reject) => {
        if(null === chemicalList){
            reject(process.env.MESSAGE_FIND_ERROR);
        }
        if (null === chemicalList.chemicals.id(chemicalId)) {
            reject(process.env.MESSAGE_FIND_ERROR);
        }
        else
            chemicalIndex = chemicalList.chemicals.indexOf(chemicalList.chemicals.id(chemicalId));
        chemicalList.chemicals.splice(chemicalIndex, 1);
        resolve(chemicalList);
    });
}

const _updateChemical = function (req, res, _fillChemical) {
    const essentialoilId = _getEssentialoilIdFromRequest(req);
    const chemicalId = _getChemicalIdFromRequest(req);
    const response = _createResponse();

    _findChemicals(essentialoilId)
        .then((foundChemicals) => _ensureChemicalExists(foundChemicals, chemicalId))
        .then((foundChemicalsWithTargetChemical) => _fillChemical(foundChemicalsWithTargetChemical, req))
        .then((updatedChemicalList) => _saveChemicalList(updatedChemicalList))
        .then((savedChemicalList) => _fillResponseWithSavedChemicals(savedChemicalList, response))
        .catch((err) => _fillResponseWithUpdateError(err, response))
        .finally(() => _sendResponse(res, response));

}

const _fillResponseWithUpdateError = function (err, response) {
    console.log("Update error", err);
    if(err === process.env.MESSAGE_RESOURCE_NOT_FOUND){
        response.status = process.env.STATUS_RESOURCE_NOT_FOUND;
        response.message = {"message": err};
    }
    else if(err._message == process.env.ERROR_ESSENTIALOIL_VALIDATION){
        response.status = process.env.STATUS_INVALID_REQUEST;
        response.message = {"message": process.env.MESSAGE_CHEMICAL_VALIDATION_FAILED};
    }
    else{
    response.status = process.env.STATUS_UPDATE_ERROR;
    response.message = { "message": process.env.MESSAGE_UPDATE_ERROR };
    }
}


const _ensureChemicalExists = function (chemicalList, chemicalId) {
    return new Promise((resolve, reject) => {
        if(null === chemicalList){
            reject(process.env.MESSAGE_RESOURCE_NOT_FOUND);
        }
        if (null === chemicalList.chemicals.id(chemicalId)) {
            reject(process.env.MESSAGE_RESOURCE_NOT_FOUND);
        }
        else {
            resolve(chemicalList);
        }
    })
}


const partialUpdateChemical = function (req, res) {
    _updateChemical(req, res, _partiallyFillChemical);
}


const fullUpdateChemical = function (req, res) {
    _updateChemical(req, res, _fullyFillChemical);
}


const _getChemicalIdFromRequest = function (req) {
    return req.params.chemicalId;
}

const _fullyFillChemical = function (foundChemicals, req) {
    return new Promise((resolve) => {
        const chemicalId = _getChemicalIdFromRequest(req);
        foundChemicals.chemicals.id(chemicalId).name = req.body.name;
        foundChemicals.chemicals.id(chemicalId).category = req.body.category;
        resolve(foundChemicals);
    })

}

const _partiallyFillChemical = function (foundChemicals, req) {
    return new Promise((resolve) => {
        const chemicalId = _getChemicalIdFromRequest(req);
        if (req.body.name) {
            foundChemicals.chemicals.id(chemicalId).name = req.body.name;
        }
        if (req.body.category) {
            foundChemicals.chemicals.id(chemicalId).category = req.body.category;
        }
        resolve(foundChemicals);
    });
}



module.exports = {
    getAllChemicals,
    createChemical,
    getOneChemical,
    deleteOneChemical,
    fullUpdateChemical,
    partialUpdateChemical
}