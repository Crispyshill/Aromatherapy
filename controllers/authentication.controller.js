const jwt = require("jsonwebtoken");

module.exports.authenticate = function(req, res, next){
    if(req.headers.authorization){
    const token = req.headers.authorization.split(" ")[1];
    console.log("authorization", token)

    console.log("Authenticate called");

    const returnValue = jwt.verify(token, "CS572"); 
    if(returnValue){
        next();
    }
    }
    else{
        res.status(401).json({"message": "Unauthorized"})
    }
}