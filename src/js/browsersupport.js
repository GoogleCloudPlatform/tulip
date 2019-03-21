//https://ai.github.io/audio-recorder-polyfill/
//https://github.com/ai/audio-recorder-polyfill
if (!window.MediaRecorder) {
    document.write(
        decodeURI('%3Cscript defer src="js/polyfill.js">%3C/script>')
    )
};
    
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
    
window.AudioContext = window.AudioContext|| window.webkitAudioContext||window.mozAudioContext;