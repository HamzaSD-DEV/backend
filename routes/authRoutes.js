const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/auth/login', authController.login);
router.post('/auth/signing', authController.signin);


module.exports = router;