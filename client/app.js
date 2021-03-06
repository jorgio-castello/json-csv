let form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let filename = document.querySelector('#filename').value;
  let data = document.querySelector('#data').value;

  fetch('http://127.0.0.1:3000/createCSV', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filename, data})
  })
  .then(res => res.text())
  .then(table => {
    let div = document.createElement('div');
    div.setAttribute('class', 'csvContainer');
    div.innerHTML = table;

    if(document.querySelector('table')) {
      let container = document.querySelector('.csvContainer');
      container.remove();
    }

    document.querySelector('html').append(div);


    //Event Listener to download CSV file
    let downloadBtn = document.querySelector('.csv-download-btn');

    if(downloadBtn) {
      downloadBtn.addEventListener('click', e => {
        let filename = e.target.getAttribute('id');
        window.location.assign(`http://127.0.0.1:3000/download/${filename}`);
      });
    }
  })
  .catch(err => console.log(err));
});

//Upload file event listener
document.getElementById('uploadFile').addEventListener('change', e => {
  let file = e.target.files[0];
  let extensionIdx = file.name.indexOf('.');

  let fileName = file.name.slice(0, extensionIdx);
  let fileJSON;

  let reader = new FileReader();
  reader.onload = e => {
    let filename = document.querySelector('#filename').value = fileName;
    let data = document.querySelector('#data').value = e.target.result;
  }

  reader.readAsText(file);

});

