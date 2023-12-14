const User = require('../models/user');
const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Authentication
exports.signup_get = asyncHandler(async (req, res, next) => {
    res.render('signup');
})

exports.signup_post = asyncHandler(async (req, res, next) => {
    try {
        const user = new User({
          first_name: req.body.firstname,
          last_name: req.body.lastname,
          user_name: req.body.username,
          password: req.body.password
        });
        const result = await user.save();
        res.redirect("/home");
      } catch(err) {
        return next(err);
      };
})

exports.login_get = asyncHandler(async (req, res, next) => {
    try {
        const [users, posts] = await Promise.all([
            User.find({}).exec(),
            Post.find({}).sort({ time_stamp: 1 }).populate('author').exec()
        ]);
    
        res.render('home', {
            title: 'Home',
            users: users,
            posts: posts,
            authUser: req.user // this is the problem
        })
    } catch(err) {
        console.log(err);
    }
})

// Home page
exports.home = asyncHandler(async (req, res, next) => {
    try {
        const [users, posts] = await Promise.all([
            User.find({}).exec(),
            Post.find({}).sort({ time_stamp: 1 }).populate('author').exec()
        ]);
    
        res.render('home', {
            title: 'Home',
            users: users,
            posts: posts,
            authUser: req.user
        })
    } catch(err) {
        console.log(err);
    }
});
