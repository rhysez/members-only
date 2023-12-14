const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, maxLength: 200 },
    body:  { type: String, required: true, maxLength: 500 },
    time_stamp: { type: Date },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

PostSchema.virtual('url', function() {
    return `/home/posts/${this.id}`;
});

PostSchema.virtual("time_stamp_formatted").get(function () {
    return DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Post', PostSchema);