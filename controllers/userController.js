const User = require('../models/userModel');


const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username:username, email:email, password:password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
};
module.exports={createUser}