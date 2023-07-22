const express = require('express');
const router = express.Router();
// const bodyParser = require("body-parser");
// router.use(bodyParser.json)
const userController = require('../controllers/userController');

// Define user routes
router.post('/users/create', userController.createUser);
// Other user routes...

module.exports = router;