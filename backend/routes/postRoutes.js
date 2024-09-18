const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

router.post('/post', uploadMiddleware.single('file'), postController.createPost);
router.put('/post', uploadMiddleware.single('file'), postController.updatePost);
router.get('/post', postController.getPosts);
router.get('/post/:id', postController.getPostById);
router.delete('/post/:id', postController.deletePost);

module.exports = router;
