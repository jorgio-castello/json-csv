const fs = require('fs');
const path = require('path');
const os = require('os');

let scrubFileName = filename => {
  let extensionIdx = filename.indexOf('.');
  if(extensionIdx > -1) {
    filename = filename.slice(0,extensionIdx);
  }
  filename = filename.split(' ');
  return filename.join('_');
}

let createHeaderRowForCSV = data => {
  return Object.keys(data).filter(item => item !== 'children');
}

let writeFileCSV = (filePath, data, callback) => {
  fs.writeFile(filePath, data, err => {
    if(err) {
      callback(err);
    } else {
      callback(null, filePath);
    }
  });
}

let createCSV = function(filename, parsedData, callback) {
  const filePath = path.join(__dirname, 'csvFiles', `${scrubFileName(filename)}.csv`); //Declare a file to save the converted JSON
  const output = []; //This variable will store the data in "rows" that should be written to the file path above

  let csvHeader = createHeaderRowForCSV(parsedData);

  writeFileCSV(filePath, csvHeader, (err, file) => {
    if(err) {
      callback(err);
    } else {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
          callback(err);
        } else {
          callback(null, data);
        }
      });
    }
  });

};

module.exports = createCSV;