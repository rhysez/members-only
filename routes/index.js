const express = require('express');
const router = express.Router();
const app_controller = require('../controllers/appController');
const passport = require("passport");

router.get('/', app_controller.signup_get);
router.post('/', app_controller.signup_post);

router.get('/login', app_controller.login_get);
router.post('/login', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  }));

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

router.get('/home', app_controller.home);

router.get('/membership', app_controller.membership_get);
router.post('/membership', app_controller.membership_post);

router.get('/create_post', app_controller.create_post_get);
router.post('/create_post', app_controller.create_post_post);

module.exports = router;
