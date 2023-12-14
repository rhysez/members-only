require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const membersOnlyRouter = require('./routes/members-only')

var app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;
if (!mongoDB) {
  console.error('Error: MONGODB_CONNECTION_STRING is not defined.');
} else {
  console.log('MONGODB_CONNECTION_STRING is successfully captured.');
}

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/members-only', membersOnlyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
