const mongoose = require('../db-connector');

const scoreBoardSchema = new mongoose.Schema({
    id: Number,
    score: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdOn: Date
});

const Scores = mongoose.model("score-board", scoreBoardSchema)
module.exports = Scores;
