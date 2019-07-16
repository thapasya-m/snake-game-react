const mongoose = require('../db-connector');

const userSchema = new mongoose.Schema({
    id: Number,
    emailId: String,
    password: String
});

const Users = mongoose.model("user", userSchema)
module.exports = Users;
