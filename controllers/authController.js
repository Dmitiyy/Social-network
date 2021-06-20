const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getNewToken = async (id) => {
    const token = await jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}

exports.signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;
    
        const user = await User.create({name, email, password});
        
        const token = await getNewToken(user._id);

        res.status(201).json({status: 'success', token, data: user});
    } catch (err) {
        res.status(500).json({status: 'fail', data: err});
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({status: 'fail', data: 'Provide your data'});
        }
    
        const user = await User.findOne({email}).select('+password');
    
        if (!user) {
            return res.status(404).json({status: 'fail', data: "User doen't exist"});
        }
    
        if (!(await user.correctPassword(password, user.password))) {
            return res.status(401).json({status: 'fail', data: 'Incorrect email or password'});
        }
    
        const token = await getNewToken(user._id);
    
        res.status(200).json({status: 'success', token});
    } catch (err) {
        res.status(500).json({status: 'fail', data: err});
    }
}

exports.protect = async (req, res, next) => {
    try {
        let token;
        let currentUserId;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
    
        if (!token) {
            return res.status(401).json({status: 'fail', data: 'You are not log in'});
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
            currentUserId = res.id;
        });

        const user = await User.findById(currentUserId);
    
        if (!user) {
            return res.status(401).json({status: 'fail', data: 'User does no longer exist'});
        }
    
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({status: 'fail', data: err});
    }
}

exports.getUser = (req, res) => {
    try {
        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({status: 'success', data: req.user});
    } catch (err) {
        res.status(500).json({status: 'fail', data: err});
    }
}