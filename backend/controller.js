const userModel = require('./models/Users');
const scoreModel = require('./models/Scores');

module.exports.signInUser = function (req, res) {
    const userLoginCred = req.body;
    userModel.findOne({ emailId: userLoginCred.email },
        function (err, data) {
            if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
            if (!data) {
                userModel.create({
                    emailId: userLoginCred.email, password: userLoginCred.pwd
                }, function (err, userResponse) {
                    if (err) res.status(500).send({ msg: 'Something went wrong!' + err });
                    if (!userResponse) {
                        res.status(500).send({ msg: 'Something went wrong!' + err });
                    } else {
                        res.status(200).send({ data: userResponse })
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
                        scoreModel.find({ userId: userResponse._id },
                            function (err, response) {
                                if (err) res.status(500).send({ msg: 'Something went wrong!' + err });;
                                if (response) res.status(200).send({ data: response })
                            }).sort({ score: -1 })
                    }
                })
            }
        })
}

