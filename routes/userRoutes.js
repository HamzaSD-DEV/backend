const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require("../middleware/auth");


router.get('/users',verifyToken, userController.getAllUsers);
router.get('/users/:id',verifyToken, userController.getUserById);
router.put('/users/:id/update',verifyToken, userController.updateUserById);
router.get('/users/:id/delete',verifyToken, userController.deleteUserById);


module.exports = router;