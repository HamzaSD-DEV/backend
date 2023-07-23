const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createUser = async (req, res) => {
    const {username, email, password} = req.body;
    const emailVal = email.toLowerCase();
    if (!validator.isAlphanumeric(username, 'en-US', {ignore: '-_'})) {
        return res.status(400).json({error: 'Invalid username format use only characters and numbers'});
    } else if (!validator.isEmail(email)) {
        return res.status(400).json({error: 'Invalid email format'});
    } else if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 0,
        minSymbols: 0,
        returnScore: false,
    })) {
        return res.status(400).json({error: 'Invalid password format at least 8 characters with lower and uppercase'});
    }
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
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: 'Error fetching users'});
    }
};
const getUserById = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: 'Error fetching user'});
    }
};
const updateUserById = async (req, res) => {
    try {
        const {userId} = req.params;
        const {username, email, password} = req.body;

        // Find the user by ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Update user properties
        user.username = username;
        user.email = email;
        user.password = password;

        // Save the updated user
        user = await user.save();

        res.status(200).json({message: 'User updated successfully', user});
    } catch (err) {
        res.status(500).json({error: 'Error updating user'});
    }
};

const deleteUserById = async (req, res) => {
    try {
        const {userId} = req.params;

        // Delete the user by ID
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json({message: 'User deleted successfully', user: deletedUser});
    } catch (err) {
        res.status(500).json({error: 'Error deleting user'});
    }
};
const updateUserEmail = async (req, res) => {
    try {
        const {userId} = req.params;
        const {newEmail} = req.body;

        // Find the user by ID and update the email property
        const updatedUser = await User.findOneAndUpdate(
            {_id: userId}, // Filter condition to find the user by their ID
            {email: newEmail}, // The properties you want to update
            {new: true} // The new option returns the updated user document
        );

        if (!updatedUser) {
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json({message: 'User email updated successfully', user: updatedUser});
    } catch (err) {
        res.status(500).json({error: 'Error updating user email'});
    }
};


module.exports = {createUser}