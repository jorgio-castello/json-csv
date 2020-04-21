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
  let columns = {}; //Create an object that will for column names that will prevent duplicates

  let findColumns = obj => { //recursive function that will descend through the objects to generate columns
    let cols = Object.keys(obj);
    cols.forEach(col => {
      columns[col] = true;
    });
    if(obj['children'].length) {
      for(let i = 0; i < obj['children'].length; i++) {
        findColumns(obj['children'][i]);
      }
    }
  }

  findColumns(data);
  return Object.keys(columns).filter(col => col !== 'children'); //return the column data excluding children
};

let writeFileCSV = (filePath, data, callback) => {
  fs.writeFile(filePath, data, err => {
    if(err) {
      callback(err);
    } else {
      callback(null, filePath);
    }
  });
};

let createCSVFromJSON = parsedData => {
  const output = []; //This variable will store the data in "rows" that should be written to the file path above

  //Create Header for CSV file - this will be the columns; it is captured in the keys of JSON data excluding children
  let csvHeader = createHeaderRowForCSV(parsedData);
  output.push(csvHeader.join(','));

  //Recurse through the parsed data's children and create rows for the CSV file
  let recurseData = json => {
    let row = []; //Create a row to store the csv data
    csvHeader.forEach(colName => { //loop through the columns, and grab the data from json at each column
      if(json[colName]) {
        row.push(json[colName]); //push that data into the row
      } else {
        row.push('-');
      }
    });
    output.push(row.join(',')); //push the row formatted as a comma separated string into the output
    if(json.children) { //if there are children...
      for(let i = 0; i < json.children.length; i++) { //Loop through the children and kick start the recursive process
        recurseData(json.children[i]);
      }
    }
  };

  recurseData(parsedData); //kick start the recursive process
  return output;
};

let createCSV = function(filename, parsedData, callback) {
  const filePath = path.join(__dirname, 'csvFiles', `${scrubFileName(filename)}.csv`); //Declare a file to save the converted JSON
  let output = createCSVFromJSON(parsedData);

  writeFileCSV(filePath, output.join(os.EOL), (err, file) => {
    if(err) {
      callback(err);
    } else {
      fs.readFile(file, 'utf-8', (err, fileContents) => {
        if(err) {
          callback(err);
        } else {
          fileContents = fileContents.split(os.EOL);
          fileContents = fileContents.map(row => row.split(','));
          callback(null, fileContents);
        }
      });
    }
  });

};

module.exports = createCSV;