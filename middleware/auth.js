//
// const jwt = require('express-jwt');
// const { jwtSecretKey } = require('../config/config');
//
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//
//     if (!token) {
//         return res.status(401).json({ error: 'No token provided' });
//     }
//
//     jwt.verify(token, jwtSecretKey, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ error: 'Failed to authenticate token' });
//         }
//         req.userId = decoded.id;
//         next();
//     });
// };
//
// module.exports = {
//     verifyToken,
// };
