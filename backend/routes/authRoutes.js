const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const getUserBlogCount = require('../controllers/authController')

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.profile);
router.post('/logout', authController.logout);
router.get('/user/:userId/blog-count', authController.getUserBlogCount);

module.exports = router;
