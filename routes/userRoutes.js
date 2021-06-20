const express = require('express');
const { signup, login, protect, getUser } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/getUser', protect, getUser);
router.get('/', protect, getAllUsers);

module.exports = router;