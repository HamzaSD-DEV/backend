const validateData = require("../middleware/dataValidation");

const User = require("../models/userModel");
const {createJwtToken} = require("../middleware/auth");
const bcrypt = require("bcrypt");
const signin = async (req, res) => {
    const {username, email, password} = req.body;
    const emailVal = email.toLowerCase();
    validateData.validateSignin(username,email,password);
    bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
            console.error('hash generation fails ', err);
            return res.status(500).json({error: 'hash generation fails'});
        } else {

            try {
                const existingUsername = await User.findOne({"username": username});
                if (existingUsername) {
                    return res.status(400).json({error: 'Username already used'});
                }
                const existingEmail = await User.findOne({"email": emailVal});
                if (existingEmail) {
                    return res.status(400).json({error: 'Email already used'});
                }
                const newUser = new User({username: username, email: emailVal, password: hash});
                await newUser.save();
                res.status(201).json({message: 'User created successfully', user: newUser});
            } catch (err) {
                console.log('Error creating user', err)
                res.status(500).json({error: 'Error creating user\n',err});
            }

        }
    });

};
const login = async (req, res) => {
    const {userInput, password} = req.body;
    const inputType = validateData.validatelogin(userInput, password, res);
    const isExistingUser = async (userInput, password) => {
        if (inputType === "it's a username") {
            try {
                const existingUser = await User.findOne({"username": userInput});
                if (!existingUser) {
                    return res.status(400).json({error: `this username ${userInput} doesn't exist`});
                } else {
                    createJwtToken(password,existingUser,res);
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
                    createJwtToken(password,existingUser,res);
                }
            } catch (err) {
                console.log('Error finding user\n', err)
                res.status(500).json({error: 'Error finding user', err});
            }
        } else {
            console.log("Internal Error Invalid inputType ", inputType)
            res.status(500).json({error: 'Internal Error Invalid inputType ', inputType});
        }
    }
    await isExistingUser(userInput, password);

};

module.exports = {login,signin}