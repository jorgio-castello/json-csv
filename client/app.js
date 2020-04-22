//Event Listener to download CSV file
let downloadBtn = document.querySelector('.csv-download-btn');

if(downloadBtn) {
  downloadBtn.addEventListener('click', e => {
    let filename = e.target.getAttribute('id');
    window.location.assign(`http://127.0.0.1:3000/download/${filename}`);
  });
}