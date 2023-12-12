#! /usr/bin/env node

console.log(
  'This script populates some test users and posts to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require('./models/user');
const Post = require('./models/post');

const users = [];
const posts = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createTestUser();
  await createTestPost();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

async function userCreate(index, firstName, lastName, userName, password, membershipStatus) {
  const userDetail = {
    first_name: firstName,
    last_name: lastName,
    user_name: userName,
    password: password,
    membership_status: membershipStatus,
  };
  const user = new User(userDetail);
  await user.save();
  users[index] = user;
  console.log(`Added user: ${firstName} ${lastName}`);
}

async function postCreate(index, title, body, timeStamp, author) {
  const postDetail = {
    title: title,
    body: body,
    time_stamp: timeStamp,
    author: author,
  };
  const post = new Post(postDetail);
  await post.save();
  posts[index] = post;
  console.log(`Added post: ${title}`);
}

async function createTestUser() {
  console.log('Adding users');
  await userCreate(0, 'Jimmy', 'Johnson', 'jimmyjohnson@odinmail.com', 'iLoveTheOdinProject', 'Club Member');
 
}

async function createTestPost() {
  console.log('Adding posts');
  await postCreate(
      0,
      'Some interesting post title',
      `A very interesting post which has lots of cool information`,
      new Date(),
      users[0]
    );
}
