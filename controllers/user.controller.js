const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
require('dotenv').config();

const createOne = function(req, res){
    console.log("create one user recieved");
    let newUser = _getUserFromRequest(req);
    const response = {
        status: 200,
        message: []
    }

    console.log("plain text pass", newUser.password);
    newUser.password = bcrypt.hashSync(newUser.password + "", bcrypt.genSaltSync(14));
    User.create(newUser)
                .then((createdUser) => {response.status = 201; response.message = createdUser})
                .catch((err) => {console.log("Error creating user", err); response.status = 500; response.message = {"message": "Error creating user"}})
                .finally(() => {res.status(response.status).json(response.message)});

}

const login = function(req, res){
    console.log("login request recieved");
    let credentials = _getCredentialsFromRequest(req);
    const response = {
        status: 200,
        message: []
    }
    User.findOne({"username": credentials.username})
            .then((databaseUser) => { console.log("databaseUser:", databaseUser.password, "credentials", credentials.password);if(bcrypt.compareSync(credentials.password + "", databaseUser.password)){
                response.status = 200;
                // response.message = {"message": "Authentication Successfull"};
                response.message = databaseUser;

            }
            else{
                response.status = 400;
                response.message = {"message": "Unauthorized"};
            }
        })
        .catch((err) => {console.log("Error finding user with username", err); response.status = 500; response.message = {"message": "Error logging in"}})
        .finally(() => {res.status(response.status).json(response.message)});
}

const _getUserFromRequest = function(req){
    return {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    }
}

const _getCredentialsFromRequest = function(req){
    return {
        username: req.body.username,
        password: req.body.password
    }
}

module.exports = {
    createOne,
    login
}

