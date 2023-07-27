const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require("../middleware/auth");


router.get('/users',verifyToken, userController.getAllUsers);
router.get('/users/:id',verifyToken, userController.getUserById);
router.delete('/users/:userId/delete',verifyToken, userController.deleteUserById);
router.put('/users/:id/update/email',verifyToken, userController.updateEmailById);
router.put('/users/:id/update/username',verifyToken, userController.updateUsernameById);
router.put('/users/:id/update/password',verifyToken, userController.updatePasswordById);

module.exports = router;