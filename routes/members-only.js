const express = require('express');
const router = express.Router();
const passport = require('passport');

const app_controller = require('../controllers/appController')

// App routes

router.get('/', app_controller.signup_get);

router.post('/', app_controller.signup_post);

router.get('/login', app_controller.login_get);

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
}));

router.get('/home', app_controller.home);

module.exports = router;