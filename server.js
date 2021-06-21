const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const bodyParser = require("body-parser");
const cors = require("cors");
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config({path: 'config.env'});

const app = express();
const port = process.env.PORT || 5000;
const DB = process.env.CONNECTION.replace('<PASSWORD>', process.env.PASSWORD);
// app.use(bodyParser.json());
app.use(cors());

app.use(express.json());

app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

app.use(express.static(path.join(__dirname, '/client/build')))
// app.use(express.static(__dirname))

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

cloudinary.config({
    cloud_name: 'dzromyqmf',
    api_key: '579622418613484',
    api_secret: 'cqz4jdMA4Oh2tTDJwMTDGmCaaD8'
});


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => console.log('DB connection successful'));

app.listen(port, () => {
    console.log('Server is working');
});