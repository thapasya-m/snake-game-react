const express = require('express');
const api = express.Router();
const controller = require('./controller');

api.post("/signIn", controller.signInUser);
api.post("/score", controller.addNewScore)
api.get("/score/:emailId", controller.getScoreByUser)
module.exports = api;