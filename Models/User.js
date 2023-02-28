const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    isAdmin: Boolean,
    phoneNumber: Number,
    fullName: String
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;