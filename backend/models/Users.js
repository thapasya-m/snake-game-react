const mongoose = require('../db-connector');

const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    emailId: String,
    password: String
});

const Users = mongoose.model("user", userSchema)
module.exports = Users;
