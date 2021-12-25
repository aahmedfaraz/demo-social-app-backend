const express = require('express');
const auth = require("../middleware/auth");
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

// @route GET /api/auth
// @desc Get the logged in user - After LOGIN + SIGNUP
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select({ "password" : 0, "__v" : 0 });
        res.status(200).json(user);
    } catch (err) {
        console.log('Error Message : ', err.message);
        res.status(500).json({ msg : 'Server Error' })
    }
});

// @route POST /api/auth
// @desc Authorize the User and Get the token - After LOGIN
// @access Private
router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors : errors.array() });
    const { email, password } = req.body;
    try {
        // Check email
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ msg : 'A user with this email does not exist' });
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg : 'Incorrect Password' })
        // Create Token
        const payload = {
            user : {
                id : user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000000,
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({token})
        })
    } catch (err) {
        console.log('Error Message : ', err.message);
        res.status(500).json({ msg : 'Server Error' })
    }
});

module.exports = router;