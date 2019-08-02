const userModel = require('./models/Users');
const scoreModel = require('./models/Scores');
const mongoose = require('./db-connector');

module.exports.signInUser = async function (req, res) {
    const userLoginCred = req.body;
    try {
        const response = await getUserByEmailId(userLoginCred.emailId);
        const userResponse = await verifyUser(userLoginCred);
        res.status(200).send(userResponse);
    } catch (err) {
        console.log("err catch", err.message)
        if (err.message === "No such user.") {
            try {
                const user = getUserModel(userLoginCred);
                const response = await createUser(user);
                res.status(200).send(response);
            } catch (error) {
                res.status(500).send({ msg: err.message });
            }
        } else
            res.status(500).send({ msg: err.message });
    }
}
module.exports.addNewScore = async function (req, res) {
    const userData = req.body;
    console.log("userData", userData);
    try {
        const response = await getUserByEmailId(userData.emailId);
        const score = getScoreModel(response, userData.score)
        const sc = await scoreModel.find({ score: score.score });
        const scoreResponse = await createScore(score);
        res.status(200).send({ data: scoreResponse })
    } catch (err) {
        console.log("err catch", err.message)
        res.status(500).send({ msg: err.message });
    }
}
module.exports.getScoreByUser = async function (req, res) {
    const emailId = req.params["emailId"]
    try {
        let response = await getUserByEmailId(emailId);
        let scoreResponse = await getScoreByUserId(response._id);
        res.status(200).send({ data: scoreResponse })
    } catch (error) {
        console.log("err catch", error.message)
        res.status(500).send({ msg: error.message });
    }
}
function createScore(score) {
    return new Promise(function (resolve, reject) {
        score.save(function (err, response) {
            if (err) reject(new Error(err));
            if (response) {
                console.log("store score", response)
                resolve(response)
            }
        })
    })
}
function createUser(user) {
    return new Promise(function (resolve, reject) {
        user.save(function (err, response) {
            if (err) reject(new Error(err));
            if (response) resolve({ emailId: response.emailId })
        })
    })
}
function getUserByEmailId(emailId) {
    return new Promise(function (resolve, reject) {
        userModel.findOne({ emailId: emailId }, function (err, user) {
            if (err) reject(new Error(err))
            if (!user) reject(new Error('No such user.'))
            else resolve(user)
        })
    })
}
function verifyUser(data) {
    return new Promise(function (resolve, reject) {
        userModel.findOne(data, function (err, response) {
            if (err) reject(new Error(err))
            if (!user) reject(new Error('Wrong password.'))
            else resolve({
                emailId: response.emailId
            })
        })
    })
}
function getScoreByUserId(id) {
    return new Promise(function (resolve, reject) {
        scoreModel.find({ userId: id }).sort({ score: -1 }).limit(10).
            exec(function (err, response) {
                if (err) reject(new Error(err))
                if (response.length === 0)
                    reject(new Error('No score by given user.'))
                else resolve(response)
            })
    })
}
function getScoreModel(user, score) {
    const scoreObj = new scoreModel({
        _id: mongoose.Types.ObjectId(),
        userId: user._id,
        score: score,
        createdOn: new Date()
    });
    return scoreObj;
}
function getUserModel(user) {
    const _user = new userModel({
        _id: mongoose.Types.ObjectId(),
        emailId: user.email,
        password: user.pwd
    });
    return _user
}