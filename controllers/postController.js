const cloudinary = require('cloudinary').v2;
const Post = require('../models/Post');
const User = require('../models/User');

exports.getAllPosts = async (req, res, next) => {
    const posts = await Post.find();
    req.posts = posts;
    next();
}

exports.renderAllPosts = (req, res) => {
    const posts = req.posts;
    res.status(200).json({status: 'success', data: posts});
}

exports.createPost = async (req, res) => {
    try {
        const {title, description, like, image} = req.body;
        let photoActive = {}; 

        if (image) {
            const result = await cloudinary.uploader.upload(image, {folder: 'Falet/'});
            photoActive = result;
        }

        let imageResult = image ? photoActive.url : '';

        const postData = {title, description, like, image: imageResult};

        const post = await Post.create(postData);

        const user = await User.findByIdAndUpdate(req.user._id, {myPosts: [...req.user.myPosts, post]});

        res.status(201).json({status: 'success', data: [post, user]});
    } catch (err) {
        console.log(err);
        res.status(500).json({status: 'fail', data: err});
    }
}

exports.addPostToFavorite = async (req, res) => {
    try {
        const {favoritePosts, myPosts} = req.body;

        const user = await User.findByIdAndUpdate(req.user._id, {favoritePosts, myPosts});

        res.status(200).json({status: 'success', data: user});
    } catch (err) {
        res.status(500).json({status: 'fail', data: err});
    }
}