const User = require('../models/user');
const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Home page
exports.auth_get = asyncHandler(async (req, res, next) => {
    res.render('index');
})

exports.auth_post = asyncHandler(async (req, res, next) => {
    try {
        const user = new User({
          first_name: req.body.firstname,
          last_name: req.body.lastname,
          user_name: req.body.username,
          password: req.body.password
        });
        const result = await user.save();
        res.redirect("/members-only/home");
      } catch(err) {
        return next(err);
      };
})

exports.home = asyncHandler(async (req, res, next) => {
    try {
        const [users, posts] = await Promise.all([
            User.find({}).exec(),
            Post.find({}).sort({ time_stamp: 1 }).populate('author').exec() // populate isn't working
        ]);
    
        res.render('home', {
            title: 'Home',
            users: users,
            posts: posts
        })
    } catch(err) {
        console.log(err);
    }
});
