const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, maxLength: 200 },
    body:  { type: String, required: true, maxLength: 500 },
    time_stamp: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

PostSchema.virtual('url', function() {
    return `/home/posts/${this.id}`;
});

module.exports = mongoose.model('Post', PostSchema);