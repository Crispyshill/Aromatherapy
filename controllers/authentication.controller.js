const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.authenticate = function(req, res, next){
    if(req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];

    const returnValue = jwt.verify(token, process.env.JWT_SECRET); 
    if(returnValue){
        next();
    }
    }
    else{
        res.status(401).json({"message": process.env.MESSAGE_UNAUTHORIZED})
    }
}