const express = require('express');
const router = express.Router();

const app_controller = require('../controllers/appController')

// App routes

router.get('/', app_controller.index)

router.get('/home', app_controller.home);

module.exports = router;