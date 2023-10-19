const mongoose = require("mongoose");
require("./essentialoil.model");
require("./user.model");
const callbackify = require("util").callbackify;
require("dotenv").config();

const disconnectWithCallback = callbackify(function(){
    return mongoose.disconnect();
});

mongoose.connect(process.env.DB_URL);

mongoose.connection.on("connected", function(){
    console.log(process.env.DB_CONNECTED_MESSAGE);
});

mongoose.connection.on("disconnected", function(){
    console.log(process.env.DB_DISCONNECTED_MESSAGE);
});


mongoose.connection.on("error", function(error){
    console.log(process.env.DB_CONNECTION_ERROR_MESSAGE, error);
});

process.on("SIGINT", function(){
    disconnectWithCallback(function(){
        process.exit(0);
    });

});
