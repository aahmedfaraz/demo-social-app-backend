const express = require('express');

const router = express.Router();

// @route GET /api/posts
// @desc Read all posts
// @access Private

// @route GET /api/posts/
// @desc Read all posts of particular user
// @access Private

router.get('/', (req, res) => {
    res.status(200).json({ msg : 'Inside Posts' })
})

// @route POST /api/posts
// @desc Add a new post
// @access Private

// @route PUT /api/posts:id
// @desc Update a post
// @access Private

// @route DELETE /api/posts:id
// @desc Delete a Post
// @access Private

module.exports = router;