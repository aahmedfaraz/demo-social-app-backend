const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route POST /api/user
// @desc Create User in DB
// @access Public
router.post('/',[
    check('name', 'Please enter name of above 5 characters').not().isEmpty().isLength({ min : 5 }),
    check('email', 'Please enter a valid email').not().isEmpty().isEmail(),
    check('password', 'Please enter password of above 5 and below 20 characters').not().isEmpty().isLength({ min : 5, max : 20 }),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors : errors.array() });
    const { name, email, password } = req.body;
    try {
        // Check if this email already exist
        let user = await User.findOne({email}).select("-password");
        if(user) return res.status(400).json({ message : 'User already exist' });
        // Create User
        user = new User({
            name,
            email,
        })
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Add User to DB
        await user.save();
        // Create a JWT Token with user_id and return
        const payload = {
            user : {
                id : user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'),{
            expiresIn: 36000000,
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({ token })
        })

    } catch (err) {
        console.log('Error Message : ', err.message);
        res.status(500).json({ msg : 'Server Error' })
    }
});

module.exports = router;