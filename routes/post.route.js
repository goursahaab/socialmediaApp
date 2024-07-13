const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const {
    CreatePostPage,
    CreatePost,
    PostLike,
    postdelete,
} = require("../controllers/post.controller");

/**
 * @route GET /post/create
 * @desc Render create post page
 * @access Private
 */
router.route("/create").get(isLoggedIn, CreatePostPage);


router.post("/create", isLoggedIn, CreatePost);

router.get("/like/:pid", isLoggedIn, PostLike);

// router.get("/delete_post/:pid", isLoggedIn, postdelete);

module.exports = router;