const video = document.getElementById('video');
const overlay = document.getElementById('overlay');

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
})
.then(stream => {
  video.srcObject = stream;
});

let lastText = "";

setInterval(() => {
  if (!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  Tesseract.recognize(canvas, 'eng')
  .then(({ data: { text } }) => {

    if(text.trim() && text !== lastText){
      lastText = text;
      translate(text);
    }
  });

}, 5000);

function translate(text){
  fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "auto",
      target: "en",
      format: "text"
    })
  })
  .then(res => res.json())
  .then(data => {
    overlay.innerText = data.translatedText;
  })
  .catch(() => {
    overlay.innerText = text;
  });
}
