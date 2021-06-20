const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post must have a title'] 
    },
    description: {
        type: String,
        required: [true, 'Post must have a description']
    },
    like: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: ''
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;