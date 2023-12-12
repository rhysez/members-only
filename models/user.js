const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 25 },
    last_name: { type: String, required: true, maxLength: 25 },
    user_name: { type: String, required: true, maxlength: 100 },
    password: { type: String, required: true, maxLength: 75 },
    membership_status: { type: String }
});

UserSchema.virtual('full_name', function() {
    let fullName = '';

    if (this.first_name && this.last_name) {
        fullName = `${this.first_name} ${this.last_name}`
    };

    return fullName
})

modules.exports(mongoose.model('User', UserSchema));