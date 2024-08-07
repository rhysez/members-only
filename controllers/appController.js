require("dotenv").config();
const User = require("../models/user");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { DateTime } = require("luxon");
const passport = require("passport");

// Authentication
exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render("signup");
});

exports.signup_post = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name must only contain alphanumeric characters"),
  body("lastname")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified")
    .isAlphanumeric()
    .withMessage("Last name must only contain alphanumeric characters"),
  body("username").trim().isLength({ min: 1 }).escape().withMessage("User name must be specified"),
  body("password").trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res, next) => {
    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          res.redirect("/");
        }
        if (req.body.confirmpassword === req.body.password) {
          const user = new User({
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            user_name: req.body.username,
            password: hashedPassword,
            membership_status: "Guest",
          });
          const result = await user.save();
          res.redirect("/login");
        } else {
          res.redirect("/");
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login");
});

exports.login_post = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  });
});

// Home page
exports.home = asyncHandler(async (req, res, next) => {
  try {
    const [users, posts] = await Promise.all([
      User.find({}).exec(),
      Post.find({}).sort({ time_stamp: 1 }).populate("author").exec(),
    ]);

    res.render("home", {
      title: "Home",
      users: users,
      posts: posts,
      authUser: req.user,
    });
  } catch (err) {
    console.log(err);
  }
});

// Membership page
exports.membership_get = asyncHandler(async (req, res, next) => {
  try {
    res.render("membership", {
      title: "As a member, you can...",
    });
  } catch (err) {
    console.log(err);
  }
});

exports.membership_post = [
  body("membership_password", "Passcode must be correct").equals("161151"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.redirect("/home");
    } else {
      try {
        await User.findByIdAndUpdate(req.user._id, { membership_status: "Club Member" });
        res.redirect("/home");
      } catch (err) {
        console.log(err);
      }
    }
  }),
];

// Create new post

exports.create_post_get = asyncHandler(async (req, res, next) => {
  try {
    res.render("create_post");
  } catch (err) {
    console.log(err);
  }
});

exports.create_post_post = [
  body("post_title").trim().isLength({ min: 1 }),

  body("post_message").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const dateReadable = DateTime.now().toFormat("MMMM dd, yyyy");

    const post = new Post({
      title: req.body.post_title,
      body: req.body.post_message,
      time_stamp: dateReadable,
      author: req.user._id,
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      res.redirect("/home");
    } else {
      try {
        await post.save();
        res.redirect("/home");
      } catch (err) {
        console.log(err);
      }
    }
  }),
];
