const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const DbConnect = require('./config/db');

dotenv.config({ path: './.env' });

const app = express();

// app.use(cors({ credentials: true, origin: 'https://bloggy-1-frontend.onrender.com' }));

const allowedOrigins = [
  'https://bloggy-1-frontend.onrender.com',
  'https://bloggy-1-frontend.onrender.com/post',
  'https://bloggy-1-frontend.onrender.com/create'
];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));



app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

DbConnect();

app.use(authRoutes);
app.use(postRoutes);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
