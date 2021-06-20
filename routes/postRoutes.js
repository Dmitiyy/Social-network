const express = require('express');
const { protect } = require('../controllers/authController');
const { getAllPosts, createPost, addPostToFavorite, renderAllPosts } = require('../controllers/postController');

const router = express.Router();

router.route('/addToFavorite').patch(protect, addPostToFavorite);

router.route('/').get(getAllPosts, renderAllPosts).post(protect, createPost);

module.exports = router;