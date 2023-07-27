const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const {validateUsername, validatePassword, validateEmail} = require("../middleware/dataValidation");


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('username email _id');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: 'Error fetching users'});
    }
};
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('_id username email');
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: 'Error fetching user'});
    }
};
const updateUsernameById = async (req, res) => {
    try {
        const userId = req.params.id;
        const {username} = req.body;

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Validate user data
        if (!validateUsername(username, res)) {
            return res.status(400).json({error: 'Invalid username format use only characters and numbers'});
        }

        //Check if username is used
        const existingUsername = await User.findOne({"username": username});
        if (existingUsername && existingUsername._id.toString() !== userId) {
            return res.status(400).json({error: 'Username already used'});
        }
        //Save the new username
        try {
            user.username = username;
            user = await user.save();
            res.status(200).json({message: 'User updated successfully', user});
        } catch (err) {
            console.log('Error saving user', err);
            res.status(500).json({error: 'Error saving username'});
        }

    } catch (err) {
        res.status(500).json({error: 'Error updating username'});
    }
};
const updatePasswordById = async (req, res) => {
    try {
        const userId = req.params.id;
        const {oldPassword, newPassword} = req.body;

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Validate user data
        if (!validatePassword(oldPassword, res)) {
            return res.status(400).json({error: 'Invalid OLD password format at least 8 characters with lower and uppercase'});
        }
        if (!validatePassword(newPassword, res)) {
            return res.status(400).json({error: 'Invalid NEW password format at least 8 characters with lower and uppercase'});
        }

        // Check if oldPassword
        bcrypt.compare(oldPassword, user.password, async function (err, result) {
            if (result) {
                try {
                    bcrypt.hash(newPassword, 10, async function (err, hash) {
                        if (err) {
                            console.error('hash generation fails ', err);
                            return res.status(500).json({error: 'hash generation fails'});
                        } else {
                            user.password = hash;
                            user = await user.save();
                            res.status(200).json({message: 'User password updated successfully'});
                        }
                    })
                } catch (err) {
                    console.log('Error saving new password', err);
                    res.status(500).json({error: 'Error saving new password'});
                }
            } else
                return res.status(400).json({error: "Wrong OLD password !!"});
        });

    } catch (err) {
        console.log('Error updating user password',err)
        res.status(500).json({error: 'Error updating user password'});
    }
};
const updateEmailById = async (req, res) => {
    try {
        const userId = req.params.id;
        const {email} = req.body;

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Validate user data
        if (!validateEmail(email)) {
            return res.status(400).json({error: 'Invalid email format'});
        }


        const existingEmail = await User.findOne({"email": email});
        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({error: 'Email already used'});
        }


        user.email = email;
        user = await user.save();
        res.status(200).json({message: 'Email updated successfully'});

    } catch (err) {
        console.log('Error updating user email', err);
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

module.exports = {
    getAllUsers,
    getUserById,
    updatePasswordById,
    updateEmailById,
    deleteUserById,
    updateUsernameById
}