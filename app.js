const express = require("express");
require("./data/db");
const app = express();
const essentialoilRouter = require("./routers/essentialoil.router");
const chemicalRouter = require("./routers/chemical.router");
const userRouter = require("./routers/user.router");
require("dotenv").config();

const noMatchForRequest = function(req, res){
    res.status(process.env.STATUS_RESOURCE_NOT_FOUND).json({message: process.env.MESSAGE_NO_MATCHING_ROUTE});
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api", function(req, res, next){
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header("Access-Control-Allow-Headers", 'Content-Type');
    res.header("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
    next();
});

app.use("/api/users", userRouter);
app.use(process.env.PATH_API + process.env.PATH_ESSENTIALOILS, essentialoilRouter);
app.use(process.env.PATH_API + process.env.PATH_ESSENTIALOILS, chemicalRouter);
app.use(noMatchForRequest);

const server = app.listen(process.env.PORT, function(){
    console.log(process.env.SERVER_START_MESSAGE, server.address().port);
});