const fs = require('fs');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const dotenv = require('dotenv');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

dotenv.config({ path: '../.env' });

exports.createPost = async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath || '',
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};

exports.updatePost = async (req, res) => {
  try {
    let newPath = null;

    // Check if a file is uploaded
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path + '.' + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }

      // Update the post fields
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newPath ? newPath : postDoc.cover;

      // Save the updated post
      await postDoc.save();

      res.json(postDoc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};


exports.getPosts = async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']).populate('comments.user', ['username']);
  res.json(postDoc);
};

exports.deletePost = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json('Token not provided');
    }

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;

      const { id } = req.params;
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }

      await postDoc.deleteOne();

      res.json('Post deleted successfully');
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};


//likes,comments

exports.likePost = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json('Token not provided');
    }

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;

      const { id } = req.params;
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      const hasLiked = postDoc.likes.includes(info.id);
      if (hasLiked) {
        // If already liked, remove the like
        postDoc.likes = postDoc.likes.filter(userId => !userId.equals(info.id));
      } else {
        // If not liked, add the like
        postDoc.likes.push(info.id);
      }

      await postDoc.save();
      res.json(postDoc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};

exports.addComment = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json('Token not provided');
    }

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;

      const { id } = req.params;
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      const { text } = req.body;
      const newComment = {
        user: info.id,
        text,
      };

      postDoc.comments.push(newComment);
      await postDoc.save();

      res.json(postDoc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json('Token not provided');
    }

    jwt.verify(token, process.env.SECRET, {}, async (err, info) => {
      if (err) throw err;

      const { id } = req.params; // Assuming you're passing the post ID in the request
      const postDoc = await Post.findById(id);

      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      // Find the comment index using its ID
      const commentIndex = postDoc.comments.findIndex(comment => comment._id.toString() === req.params.commentId);

      if (commentIndex === -1) {
        return res.status(404).json('Comment not found');
      }

      // Check if the user is the author of the comment
      if (!postDoc.comments[commentIndex].user.equals(info.id)) {
        return res.status(403).json('You are not authorized to delete this comment');
      }

      // Remove the comment using splice
      postDoc.comments.splice(commentIndex, 1);
      await postDoc.save();

      res.json(postDoc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};
