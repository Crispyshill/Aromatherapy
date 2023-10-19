const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    username: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
})

mongoose.model("User", UserSchema, "users");