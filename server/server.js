const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../client')));

app.listen(3000, () => console.log('Server is up and running on Port 3000...'));