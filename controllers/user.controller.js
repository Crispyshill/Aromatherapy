const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const createOne = function (req, res) {
    console.log("create one user recieved");
    let newUser = _getUserFromRequest(req);
    const response = createResponse();

    bcrypt.genSalt(14)
        .then((generatedSalt) => bcrypt.hash(newUser.password + "", generatedSalt))
        .then((hash) => _putHashInUser(newUser, hash))
        .then((newUserWithHash) => _createNewUser(newUserWithHash))
        .then((createdUser) => _fillResponseWithNewUser(createdUser, response))
        .catch((err) => _fillResponseWithCreateError(err, response))
        .finally(() => _sendResponse(response, res));

}

const _fillResponseWithCreateError = function(err, response){
    console.log("Create user errror", err);
    if(err._message == process.env.ERROR_USER_VALIDATION){
        response.status = process.env.STATUS_INVALID_REQUEST;
        response.message = {"message": process.env.MESSAGE_USER_VALIDATION_FAILED};
    }
    else{
        response.status = process.env.STATUS_CREATE_ERROR;
        response.message = {"message": process.env.MESSAGE_CREATE_ERROR}
    }
}



const _fillResponseWithNewUser = function(newUser, response){
        response.status = process.env.STATUS_CREATED;
        response.message = newUser;
}

const _putHashInUser = function(newUser, hash){
    return new Promise((resolve, reject) => {
        newUser.password = hash;
        console.log("Put has in", newUser);
        resolve(newUser);
    });
}

const _createNewUser = function(newUser){
    console.log("Creating user", newUser);
    return User.create(newUser);
}

const createResponse = function(){
    return {
        status: 200,
        message: []
    }
}



const login = function (req, res) {
    console.log("login request recieved");
    console.log("request", req)
    let credentials = _getCredentialsFromRequest(req);
    const response = createResponse();

    _findUserByUsername(credentials.username)
        .then((databaseUser) => _checkIfUserIsEmpty(databaseUser))
        .then((nonEmptyUser) => _verifyCredentials(credentials.password + "", nonEmptyUser))
        .then((verifiedUser) => _generateToken(verifiedUser.name))
        .then((userToken) => _fillResponseWithToken(userToken, response))
        .catch((err) => _fillResponseWithLoginError(err, response))
        .finally(() => _sendResponse(response, res));
}

const _sendResponse = function(response, res){
    res.status(response.status).json(response.message);
}

const _fillResponseWithLoginError = function(err, response){
    console.log("login error", err);
    if(err === process.env.MESSAGE_RESOURCE_NOT_FOUND){
        response.status = process.env.STATUS_UNAUTHORIZED;
        response.message = {"message": process.env.MESSAGE_UNAUTHORIZED};
    }
    else{
        response.status = process.env.STATUS_LOGIN_ERROR
        response.message = {"message": process.env.MESSAGE_LOGIN_ERROR}
    }
}

const _findUserByUsername = function(username){
    return User.findOne({"username": username}).exec();
}


const _fillResponseWithToken = function (token, response) {
    response.status = 200;
    response.message = { "token": token };
}

const _checkIfUserIsEmpty = function (user) {
    return new Promise((resolve, reject) => {
        if (null === user) {
            reject(process.env.MESSAGE_RESOURCE_NOT_FOUND);
        }
        else {
            resolve(user);
        }
    })
}

const _verifyCredentials = function (sentPassword, databaseUser) {
    console.log("Verifying credentials unhashed p", sentPassword, "Hashed p", databaseUser.password)
    return new Promise((resolve, reject) => {
        bcrypt.compare(sentPassword, databaseUser.password)
            .then((match) => {if(match){console.log("Matching"), resolve(databaseUser);}else{console.log("not matching");reject(databaseUser)}})
            .catch(err => {console.log("err", err); reject(process.env.STATUS_RESOURCE_NOT_FOUND);})

    })
}

const _generateToken = function (name) {
    console.log("Generating token", name)
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ "name": name }, process.env.JWT_SECRET); //This should be secret and be in the environment variables PUT IN .ENV
        resolve(token);
    });
}

const _getUserFromRequest = function (req) {
    return {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }
}

const _getCredentialsFromRequest = function (req) {
    return {
        username: req.body.username,
        password: req.body.password
    }
}

module.exports = {
    createOne,
    login
}

