const userModel = require('./models/Users');
const scoreModel = require('./models/Scores');

function getUserModel(user) {
    const user = new userModel({
        _id: new mongoose.Types.ObjectId(),
        emailId: user.email,
        password: user.pwd
    });
    return user
}
module.exports.signInUser = function (req, res) {
    const userLoginCred = req.body;
    userModel.findOne({ emailId: userLoginCred.email },
        function (err, data) {
            if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
            if (!data) {
                const user = getUserModel(userLoginCred)
                user.save(function (err, userResponse) {
                    if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
                    if (!userResponse) {
                        res.status(500).send({ msg: 'Something went wrong!' + err });
                    } else {
                        res.status(200).send({ data: { id: userResponse._id, email: userResponse.emailId } })
                    }
                })
            } else {
                userModel.findOne({
                    emailId: userLoginCred.email,
                    password: userLoginCred.pwd
                }, function (err, userResponse) {
                    if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
                    if (!userResponse) {
                        res.status(500).send({ msg: 'Wrong password!' })
                    } else {
                        res.status(200).send({
                            data: {
                                id: userResponse._id,
                                emailId: userResponse.emailId
                            }
                        })
                    }
                })
            }
        })
}
function getScoreModel(user, score) {
    const scoreObj = new scoreModel({
        _id: new mongoose.Types.ObjectId(),
        userId: user._id,
        score: score
    });
    return scoreObj;
}
module.exports.addNewScore = function (req, res) {
    const userData = req.body;
    console.log(userData.id)
    userModel.find({ emailId: userData.id }, function (err, user) {
        if (err) res.status(500).send({ msg: "Something went wrong" + err });
        if (!user) res.status(500).send({ msg: "User not found for given id" });
        else {
            const scoreModel = getScoreModel(userData.score, user)
            scoreModel.save(function (err, score) {
                if (err) res.status(500).send({ msg: "Something went wrong" + err });
                res.status(200).send({ data: score })
            })
        }
    })
}

module.exports.getScoreByUser = function (req, res) {
    const _user = {
        id: req.params["id"],
        emailId: req.params["emailId"]
    }
    userModel.findOne({ emailId: _user.emailId }, function (err, user) {
        if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
        if (!user) res.status(500).send({ msg: 'No such user!' });
        else
            scoreModel.
                find({ userId: user.id }).sort({ score: -1 }).
                exec(function (err, response) {
                    if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
                    if (response) res.status(200).send({
                        data: response
                    })
                })
    })

}
