const createCSV = require('./createCSV.js');

//Set up Express
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

//Set up app
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client')));









app.get('/', (req, res) => {
  res.send('Goodybe World');
});

app.post('/createCSV', (req, res) => {
  let data = JSON.parse(req.body.jsonData);
  let csv = createCSV(data); //This function will generate a csv file, store in csvFiles, and return the filename
  //res.sendFile(csvFiles/csv);
  res.redirect('/');
});

app.listen(3000, () => console.log('Server is up and running on Port 3000...'));