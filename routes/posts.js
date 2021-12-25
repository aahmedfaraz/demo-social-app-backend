const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// @route GET /api/posts
// @desc Read all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (err) {
    console.log("Error Message : ", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route GET /api/posts/
// @desc Read all posts of particular user
// @access Private
router.get("/:userID", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userID });
    res.status(200).json({ posts });
  } catch (err) {
    console.log("Error Message : ", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route POST /api/posts/
// @desc Add a new post
// @access Private
router.post(
  "/",
  [auth, [check("body", "Please enter post body").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { body } = req.body;
      const newPost = new Post({
        user: req.user.id,
        body,
      });

      await newPost.save();

      res.status(200).json({ post: newPost });
    } catch (err) {
      console.log("Error Message : ", err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route PUT /api/posts/:postID
// @desc Update a post
// @access Private
router.put(
  "/:postID",
  [auth, [check("body", "Please enter text inside body").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      // Check if post exists
      let post = await Post.findById(req.params.postID);
      if (!post)
        return res.status(400).json({ msg: "This post does not exist" });

      // Check if user has rights
      if (post.user.toString() !== req.user.id)
        return res.status(401).json({
          msg: "You do not have the correct authorization to update this post",
        });

      // Update
      const { body } = req.body;
      const changings = {};
      if (body) changings.body = body;

      post = await Post.findByIdAndUpdate(
        req.params.postID,
        { $set: changings },
        { new: true }
      );

      res.status(200).json({ post });
    } catch (err) {
      console.log("Error ", err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route DELETE /api/posts/:postID
// @desc Delete a Post
// @access
router.delete("/:postID", auth, async (req, res) => {
  try {
    // Check if post exists
    let post = await Post.findById(req.params.postID);
    if (!post) return res.status(400).json({ msg: "This post does not exist" });

    // Check if user has rights
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({
        msg: "You do not have the correct authorization to update this post",
      });

    await Post.findOneAndRemove(req.params.id);

    res.status(200).json({ msg: "The post has been deleted" });
  } catch (err) {
    console.log("Error ", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
