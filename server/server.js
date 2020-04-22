const createCSV = require('./createCSV.js');

//Set up Express
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

//Set up app
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
  res.render('report', {data: undefined});
});

app.get('/download/:filename', (req, res) => {
  let filename = req.params.filename;
  let filePath = path.join(__dirname, 'csvFiles', filename);
  res.download(filePath, filename, (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log('It is working on the server');
    }
  });
});

app.post('/createCSV', (req, res) => {
  let { filename, data } = req.body;

  //This function will generate a csv file, store in csvFiles, and send back the CSV file
  createCSV(filename, JSON.parse(data), (err, data) => {
    if(err) {
      res.send('Uh Oh, something did not work correctly');
    } else {
      res.render('report', {data: data});
    }
  });
});

app.listen(3000, () => console.log('Server is up and running on Port 3000...'));