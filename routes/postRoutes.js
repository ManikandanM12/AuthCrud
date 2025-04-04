const router = require('express').Router();
const Post = require('../models/Posts');
const { isLoggedIn } = require("../controller/authController.js");

// Create a new post
router.post('/createPost',  async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      userId: req.user.id
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err });
  }
});

// Get all posts by the authenticated user
router.get('/userPost', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});
router.get("/getUser/:id", (req, res) => {
    const id = req.params.id;
    Post.findById({ _id: id })
      .then((users) => res.json(users))
      .then((err) => console.log(err));
  });
router.put("/updateUser/:id", (req, res) => {
    const id = req.params.id;
    Post.findByIdAndUpdate(
      { _id: id },
      { title: req.body.title, content: req.body.content }
    )
      .then((users) => res.json(users))
      .catch((err) => console.log(err));
  });
// Delete a post by ID
router.delete("/deletePost/:id", (req, res) => {
    const id = req.params.id;
    Post.findByIdAndDelete({ _id: id })
      .then((users) => res.json(users))
      .catch((err) => console.log(err));
  });

module.exports = router;
