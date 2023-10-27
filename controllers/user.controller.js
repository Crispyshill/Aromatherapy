const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const createOne = function (req, res) {
    console.log("create one user recieved");
    let newUser = _getUserFromRequest(req);
    const response = {
        status: 200,
        message: []
    }

    console.log("plain text pass", newUser.password);
    newUser.password = bcrypt.hashSync(newUser.password + "", bcrypt.genSaltSync(14));
    User.create(newUser)
        .then((createdUser) => { response.status = 201; response.message = createdUser })
        .catch((err) => { console.log("Error creating user", err); response.status = 500; response.message = { "message": "Error creating user" } })
        .finally(() => { res.status(response.status).json(response.message) });

}


const login = function (req, res) {
    console.log("login request recieved");
    console.log("request", req)
    let credentials = _getCredentialsFromRequest(req);
    const response = {
        status: 200,
        message: []
    }
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
    console.log(err);
    response.status = 401;
    response.message = {"message": "Unauthorized"};
}

const _findUserByUsername = function(username){
    return User.findOne({"username": username}).exec();
}


const _fillResponseWithNoSuchUser = function (response, err) {
    console.log(err);
        console.log("No such user");
        response.status = 401;
        response.message = { "message": "No such user with given credentials" }
}

const _fillResponseWithTokenGenerationError = function (response, err) {
    console.log(err);
        console.log("Error generating token");
        response.status = 500;
        response.message = { "message": "error generating token"}

}


const _fillResponseWithUser = function (user, response) {
        response.status = 200;
        response.message = user;
}

const _fillResponseWithToken = function (token, response) {
    response.status = 200;
    response.message = { "token": token };
}

const _checkIfUserIsEmpty = function (user) {
    console.log("Checking if user is empty", user.password)
    return new Promise((resolve, reject) => {
        if (null === user) {
            reject();
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
            .catch(err => {console.log("err", err); reject();})

    })
}

const _generateToken = function (name) {
    console.log("Generating token", name)
    return new Promise((resolve, reject) => {
        const token = jwt.sign({ "name": name }, "CS572"); //This should be secret and be in the environment variables PUT IN .ENV
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

