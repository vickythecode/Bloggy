const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.post('/post', uploadMiddleware.single('file'), postController.createPost);
router.put('/post-update', uploadMiddleware.single('file'), postController.updatePost);
router.get('/posts', postController.getPosts);
router.get('/post/:id', postController.getPostById);
router.delete('/post/:id/delete', postController.deletePost);

router.post('/post/:id/like', postController.likePost);
router.post('/post/:id/comments', postController.addComment);
router.delete('/post/:id/comments/:commentId', postController.deleteComment);

module.exports = router;
