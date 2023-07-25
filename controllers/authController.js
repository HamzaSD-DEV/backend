const validateData = require("../middleware/dataValidation");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const auth = require("../middleware/auth")
const {jwtSecretKey} = require("../config/config");
const jwt =require("jsonwebtoken")
const login = async (req, res) => {
    const {userInput, password} = req.body;
    console.log(userInput, password)
    const inputType = validateData.validatelogin(userInput, password, res);
    console.log(inputType)

    const isExistingUser = async (userInput, password) => {
        if (inputType === "it's a username") {
            try {
                const existingUser = await User.findOne({"username": userInput});
                if (!existingUser) {
                    return res.status(400).json({error: `this username ${userInput} doesn't exist`});
                } else {
                    bcrypt.compare(password, existingUser.password, function (err, result) {
                        if (result) {
                            return res.status(200).json({message: "Login successfully"});
                        } else
                            return res.status(400).json({error: "Wrong password !!"});
                    });
                }
            } catch (err) {
                console.log('Error creating user', err)
                res.status(500).json({error: 'Error creating user\n', err});
            }
        } else if (inputType === "it's an email") {
            try {
                const userInputVal = userInput.toLowerCase();
                const existingUser = await User.findOne({"email": userInputVal});
                if (!existingUser) {
                    return res.status(400).json({error: `This email ${userInput} doesn't exist`});
                } else {
                    bcrypt.compare(password, existingUser.password, function (err, result) {
                        if (result) {
                            const token = jwt.sign({existingUser}, jwtSecretKey, {expiresIn: "1h"});
                            console.log(token);
                            return res.status(200).json({message: "Login successfully",token: token});
                        } else
                            return res.status(400).json({error: "Wrong password !!"});
                    });
                }
            } catch (err) {
                console.log('Error finding user\n', err)
                res.status(500).json({error: 'Error finding user\n', err});
            }
        } else {
            console.log("Internal Error Invalid inputType ", inputType)
            res.status(500).json({error: 'Internal Error Invalid inputType ', inputType});
        }
    }
    await isExistingUser(userInput, password);

};

module.exports = {login}