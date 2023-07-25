const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/users/create', userController.createUser);
// Other user routes...

module.exports = router;