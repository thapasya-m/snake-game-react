const express = require('express');
const api = express.Router();
const controller = require('./controller');

api.post("/signIn", controller.signInUser);
// api.post("/newScore", controller.addNewScore)
module.exports = api;