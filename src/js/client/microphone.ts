/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

declare var MediaRecorder: any;

const SELECTORS = {
    MIC_ELEMENT: '.microphone__element--js',
    MIC_RECORD_BUTTON: '.microphone__record_button',
    MIC_STOP_BUTTON: '.microphone__stop_button',
    AUDIO_FILE: '.microphone__file'
  };

/** Initializes and manages interaction with the camera */
export class Microphone {
    /** The HTMLAudioElement used to play audio from the microphone */
    audioElement: HTMLAudioElement;
    recordButton: HTMLElement;
    stopButton: HTMLElement;
    fileElement: HTMLElement;
    audioChunks: Array<any>;
    mediaRecorder: any;
    fileReader: any;
    audioContext: AudioContext;
    source: MediaStreamAudioSourceNode;
    scriptProcessor: ScriptProcessorNode;

    constructor() {
      /*  
      // Cross browser support for getUserMedia
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        // Cross browser support for AudioContext
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
      */

        this.fileReader = new FileReader();
        this.audioChunks = [];
        this.audioElement =
        <HTMLAudioElement>document.querySelector(SELECTORS.MIC_ELEMENT);
        this.recordButton =
        <HTMLElement>document.querySelector(SELECTORS.MIC_RECORD_BUTTON);
        this.stopButton =
        <HTMLElement>document.querySelector(SELECTORS.MIC_STOP_BUTTON);
        this.fileElement =
        <HTMLElement>document.querySelector(SELECTORS.AUDIO_FILE);
    }

  /**
   * Requests access to the microphone and return a Promise
   *
   * @async
   * @returns {Promise<>}
   */
   async setupMicrophone(stream: any) {
    let me = this;
    console.log(me);

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(s: MediaStream) {
          me.audioContext = new AudioContext();
          me.mediaRecorder = new MediaRecorder(s);
          me.getMicStream(s);

          me.mediaRecorder.addEventListener('start', (e:any) => {
            me.audioChunks = [];

            me.source.connect(me.scriptProcessor);
            me.scriptProcessor.connect(me.audioContext.destination);
          });

          me.mediaRecorder.addEventListener('dataavailable', (e:any) => {
            me.audioChunks.push(e.data);
          });

          me.mediaRecorder.addEventListener('stop', (e:any) => {
            // create a blob from the audio chunks
            let blobData = new Blob(me.audioChunks, {
              'type': 'audio/ogg;codecs=opus'
              // 'type': 'audio/wav'
              // 'type': 'audio/x-l16'
            });

            // attach the audio to the player
            me.audioElement.src = window.URL.createObjectURL(blobData);
            console.log(me.audioElement.src);

            me.source.disconnect();
            me.scriptProcessor.disconnect();
            // send audio to server
            //me.sendToServer(blobData);
          });
    });

    this.recordButton.addEventListener('click', () => {
      this.mediaRecorder.start();
    });

    this.stopButton.addEventListener('click', () => {
      this.mediaRecorder.stop();
      let event = new CustomEvent('stop', {
        detail: 'stop'
      });
      window.dispatchEvent(event);
    });

    return new Promise(resolve => {
      resolve(this.audioElement);
    });
  }

  getMicStream(s: any){
    console.log('get mic stream');
    console.log(this.audioContext.sampleRate);
    const bufferLength = 4096;
    this.source = this.audioContext.createMediaStreamSource(s);
    this.scriptProcessor =
      this.audioContext.createScriptProcessor(bufferLength,1,1);

      this.scriptProcessor.onaudioprocess = (e)=> {
        let stream = e.inputBuffer.getChannelData(0) ||
        new Float32Array(bufferLength);
        let event = new CustomEvent('audio', {
          detail: this.convertFloat32ToInt16(stream)
        });
        window.dispatchEvent(event);
      };

  }

/*
  sendToServer(blobData: Blob) {
    let me = this;
    console.log('fire event, so app.js can send this to server');
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      me.audioContext.decodeAudioData(reader.result, (b: AudioBuffer) => {
        console.log(b);
        me.reSample(b, 16000, function(newBuffer: AudioBuffer){
          let arrayBuffer =
            me.convertFloat32ToInt16(newBuffer.getChannelData(0));

          let event = new CustomEvent('audio', {
            detail: window.URL.createObjectURL(blobData)
          });
          console.log(blobData);
          console.log(arrayBuffer);
          window.dispatchEvent(event);
        });
      });
    });
    reader.readAsArrayBuffer(blobData);
  }*/

  /*
  reSample(buffer: AudioBuffer, targetSampleRate: number, cb: Function){
      let channel = buffer.numberOfChannels;
      let samples = buffer.length * targetSampleRate / buffer.sampleRate;

      let offlineContext = new OfflineAudioContext(
        channel, samples, targetSampleRate);
      let bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = buffer;

      bufferSource.connect(offlineContext.destination);
      bufferSource.start(0);

      offlineContext.startRendering().then(function(renderedBuffer){
          cb(renderedBuffer);
      });
  }*/

  handleErrors(errors: any){
      console.log(errors);
  }

  convertFloat32ToInt16(buffer:any) {
      console.log('convert32 to 16');
      let l = buffer.length;
      let buf = new Int16Array(l);
      while (l--) {
          buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
      }
      return buf.buffer;
  }
}

export let microphone = new Microphone();
