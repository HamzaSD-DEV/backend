const User = require('../models/userModel');
const dataValidation = require("../middleware/dataValidation")
const bcrypt = require("bcrypt");


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
const updateUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        // Find the user by ID
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate user data
        dataValidation.validateAll(username, email, password);

        // Check if username or email is already used
        const existingUsername = await User.findOne({ "username": username });
        if (existingUsername && existingUsername._id.toString() !== userId) {
            return res.status(400).json({ error: 'Username already used' });
        }

        const existingEmail = await User.findOne({ "email": email });
        if (existingEmail && existingEmail._id.toString() !== userId) {
            return res.status(400).json({ error: 'Email already used' });
        }

        // Update user properties
        user.username = username ? username : user.username;
        user.email = email ? email.toLowerCase() : user.email;
        user.password = password ? password : user.password;

        // Hash the password
        bcrypt.hash(user.password, 10, async function (err, hash) {
            if (err) {
                console.error('hash generation fails ', err);
                return res.status(500).json({ error: 'hash generation fails' });
            }

            // Save the updated user
            try {
                user.password = hash; // Save the hashed password
                user = await user.save();
                res.status(200).json({ message: 'User updated successfully', user });
            } catch (err) {
                console.log('Error updating user', err);
                res.status(500).json({ error: 'Error updating user' });
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error updating user' });
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


module.exports = {getAllUsers,getUserById,updateUserById,updateUserEmail,deleteUserById}