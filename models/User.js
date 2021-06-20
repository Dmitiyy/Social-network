const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name']
    }, 
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide your valid email']
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
        select: false
    },
    myPosts: {
        type: Array,
        default: []
    },
    favoritePosts: {
        type: Array,
        default: []
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (first, second) {
    return await bcrypt.compare(first, second);
}

const User = mongoose.model('User', userSchema);

module.exports = User;