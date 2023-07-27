
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config/config');
const bcrypt = require("bcrypt");

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer "

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
};

function createJwtToken(password, existingUser, res) {
    bcrypt.compare(password, existingUser.password, function (err, result) {
        if (result) {
            const token = jwt.sign({existingUser}, jwtSecretKey, {expiresIn: "1h"});
            return res.status(200).json({message: "Login successfully ", token: token});
        } else
            return res.status(400).json({error: "Wrong password !!"});
    });
}

module.exports = {
    verifyToken,createJwtToken,
};
