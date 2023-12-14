const User = require('../models/user');
const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Home page
exports.index = asyncHandler(async (req, res, next) => {
    res.send('Login page');
})

exports.home = asyncHandler(async (req, res, next) => {
    try {
        const [users, posts] = await Promise.all([
            User.find({}).exec(),
            Post.find({}).sort({ time_stamp: 1 }).populate('author').exec() // populate isn't working
        ]);
    
        res.render('index', {
            title: 'Home',
            users: users,
            posts: posts
        })
    } catch(err) {
        console.log(err);
    }
});
