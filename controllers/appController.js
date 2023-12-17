const User = require('../models/user');
const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const dotenv = require('dotenv');

// Authentication
exports.signup_get = asyncHandler(async (req, res, next) => {
    res.render('signup');
})

exports.signup_post = [
    body('firstname')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('First name must be specified')
        .isAlphanumeric()
        .withMessage('First name must only contain alphanumeric characters'),
    body('lastname')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Last name must be specified')
        .isAlphanumeric()
        .withMessage('Last name must only contain alphanumeric characters'),
    body('username')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('User name must be specified'),
    body('password')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    res.redirect('/')
                }
                if (req.body.confirmpassword === req.body.password) {
                    const user = new User({
                        first_name: req.body.firstname,
                        last_name: req.body.lastname,
                        user_name: req.body.username,
                        password: hashedPassword,
                        membership_status: 'Guest'
                    });
                    const result = await user.save();
                    res.redirect("/login");
                } else {
                    res.redirect('/')
                }
              });
          } catch(err) {
            return next(err);
          }
    }),
 ]

exports.login_get = asyncHandler(async (req, res, next) => {
    res.render('login')
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

// Membership page
exports.membership_get = asyncHandler(async (req, res, next) => {
    try {
        res.render('membership', {
            title: 'As a member, you can...',
        })
    } catch(err) {
        console.log(err);
    }
});

exports.membership_post = [
    body('membership_password', 'Passcode must be correct')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .equals(process.env.SECRET_PASSSCODE),

    asyncHandler(async (req, res, next) => {
        try {
            const [users, posts] = await Promise.all([
                User.find({}).exec(),
                Post.find({}).sort({ time_stamp: 1 }).populate('author').exec()
            ]);
            // update user membership status
            res.render('home', {
                title: 'Home',
                users: users,
                posts: posts,
                authUser: req.user
            })
        } catch(err) {
            console.log(err)
        }
    })
]