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

const corsOptions = {
  origin: 'https://bloggy-1-frontend.onrender.com', // Your frontend's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: '*',  // Allow all headers for now (you can fine-tune later)
  credentials: true,
  optionsSuccessStatus: 200,  // To handle legacy browsers
};

app.use(cors(corsOptions));



app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

DbConnect();

app.use(authRoutes);
app.use(postRoutes);

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
