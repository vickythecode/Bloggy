const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const salt = bcrypt.genSaltSync(10);

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    if ([username, password].some((field) => field?.trim() === "")) {
      return res.status(400).json('Wrong credentials bro');
    }

    const existedUser = await User.findOne({ username });
    if (existedUser) {
      return res.status(400).json('username already exists');
    }
    
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const userDoc = await User.create({ username, password: hashedPassword });
    return res.json(userDoc);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json('Wrong credentials');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, process.env.SECRET, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { httpOnly: true }).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('Wrong credentials');
    }
  } catch (e) {
    console.log(e);
    res.status(500).json('Internal server error');
  }
};

exports.profile = (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json('Token not provided');
  }
  jwt.verify(token, process.env.SECRET, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

exports.logout = (req, res) => {
  res.cookie('token', '').json('ok');
};
