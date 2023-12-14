const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController')

// User routes (including home route)

router.get('/', user_controller.index);

module.exports = router;