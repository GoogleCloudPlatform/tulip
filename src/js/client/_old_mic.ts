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
    MIC_STOP_BUTTON: '.microphone__stop_button'
  };

/** Initializes and manages interaction with the camera */
export class Microphone {
    /** The HTMLAudioElement used to play audio from the microphone */
    audioElement: HTMLAudioElement;
    recordButton: HTMLElement;
    stopButton: HTMLElement;
    audioChunks: Array<any>;
    mediaRecorder: any;
    fileReader: any;
    audioContext: AudioContext;

    constructor() {
        this.fileReader = new FileReader();
        this.audioContext = new AudioContext();
        this.audioChunks = [];
        this.audioElement =
        <HTMLAudioElement>document.querySelector(SELECTORS.MIC_ELEMENT);
        this.recordButton =
        <HTMLElement>document.querySelector(SELECTORS.MIC_RECORD_BUTTON);
        this.stopButton =
        <HTMLElement>document.querySelector(SELECTORS.MIC_STOP_BUTTON);
    }


    async setupRecorder(stream: any) {
      let me = this;
      console.log('setup recorder');
      this.recordButton.addEventListener('click', () => {
        console.log('clicked record');
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(mediaStream => {

          console.log('start');
          this.mediaRecorder = new MediaRecorder(mediaStream);
          this.mediaRecorder.start();
  
          /*this.mediaRecorder.addEventListener('audioprocess', (e:any) => {
            console.log ('recording');
            let left = e.inputBuffer.getChannelData(0);
            stream.write(me.convertFloat32ToInt16(left));
          });*/
        
          this.mediaRecorder.addEventListener('dataavailable', (e:any) => {
            console.log('data available');
            let left = e.inputBuffer.getChannelData(0);
            stream.write(me.convertFloat32ToInt16(left));
            
            microphone.audioElement.src = URL.createObjectURL(e.data);
            this.audioChunks.push(e.data);
          });

          this.mediaRecorder.addEventListener('start', (e:any) => {
            this.audioChunks = [];
          });

          this.mediaRecorder.addEventListener('stop', (e:any) => {
            console.log('finalize recording');
            console.log(this.audioChunks);
  
            let blobData = new Blob(this.audioChunks, {
               'type': 'audio/ogg;codecs=opus'
              // 'type': 'audio/wav'
              // 'type': 'audio/x-l16'
            });

            let reader = new FileReader();
            reader.addEventListener('load', (e:any) => {
              console.log("load reader");
              me.audioContext.decodeAudioData(reader.result,
                function(buffer: any){
                  console.log(buffer);
                  me._onBlobReady(buffer);
              });
            });

            reader.readAsArrayBuffer(blobData);
          });


          /*let audioInput = this.audioContext
          .createMediaStreamSource(mediaStream);
          let bufferSize = 2048;
          let recorder = this.audioContext
          .createScriptProcessor(bufferSize, 1, 1);
          // connect stream to our recorder
          audioInput.connect(recorder);
          // connect our recorder to the previous destination
          recorder.connect(this.audioContext.destination);
          console.log(stream);*/

        });
      });

      return new Promise(resolve => {
        resolve(this.audioElement);
      });
    }



  /**
   * Requests access to the microphone and return a Promise
   *
   * @async
   * @returns {Promise<>}
   */
   async setupMicrophone(stream: any) {
    // let me = this;

    this.recordButton.addEventListener('click', () => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();

        this.mediaRecorder.addEventListener('audioprocess', (e:any) => {
          console.log ('recording');
          // left = e.inputBuffer.getChannelData(0);
          // Stream.write(this.convertoFloat32ToInt16(left));
        });

        this.mediaRecorder.addEventListener('dataavailable', (e:any) => {
          microphone.audioElement.src = URL.createObjectURL(e.data);
          this.audioChunks.push(e.data);
        });

        this.mediaRecorder.addEventListener('start', (e:any) => {
          this.audioChunks = [];
        });

        this.mediaRecorder.addEventListener('stop', (e:any) => {
          console.log(this.audioChunks);

          let blobData = new Blob(this.audioChunks, {
             'type': 'audio/ogg;codecs=opus'
            // 'type': 'audio/wav'
            // 'type': 'audio/x-l16'
          });

          //this._createAudioBlob().then((blob: Blob) => {
          //  this._convertBlobToBuffer(blob, this._onBlobReady);
          //});

          let me = this;
          let reader = new FileReader();
          reader.onload = function() {
            me.audioContext.decodeAudioData(
              reader.result, function(buffer: any) {
              console.log(buffer);
              me.reSample(buffer, 16000, function(newBuffer: any){
                console.log(buffer.getChannelData(0));
                let arrayBuffer = me.convertFloat32ToInt16(
                  newBuffer.getChannelData(0));
                 console.log(arrayBuffer);
                 me._onBlobReady(arrayBuffer);
                 //me._onBlobReady(buffer.getChannelData(0));
              });
            });
          };
          reader.readAsArrayBuffer(blobData);
      
// Blob -> ArrayBuffer
/*
let uint8ArrayNew  = null;
let arrayBufferNew = null;
let fileReader     = new FileReader();
fileReader.onload  = function(ev:any) {
    arrayBufferNew = ev.target.result;
    uint8ArrayNew  = new Uint8Array(arrayBufferNew);

        let event = new CustomEvent('stream', {
          detail: uint8ArrayNew
        });

        me.audioElement.dispatchEvent(event);
};
fileReader.readAsArrayBuffer(blob);
fileReader.result; // also accessible this way once the blob has been read
*/

          /*
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() {
             //let base64 = reader.result + '';
             //base64 = base64.split(',')[1];
             let base64 = reader.result.toString();
             console.log( base64 );
              // create and dispatch the event
              let event = new CustomEvent('stream', {
                detail: blob
              });

              me.audioElement.dispatchEvent(event);
            };
           */

           /*
          let event = new CustomEvent('stream', {
            detail: blob
          });

          me.audioElement.dispatchEvent(event);
          */
         });
       });
    });
    this.stopButton.addEventListener('click', () => {
        microphone.stopRecording();
    });

    return new Promise(resolve => {
      resolve(this.audioElement);
    });
  }

  stopRecording(){
    this.mediaRecorder.stop();
  }

  getDataURL(){
    let src = this.audioElement.src;
    return src;
  }

  handleErrors(errors: any){
      console.log(errors);
  }

  async _createAudioBlob(){
    return new Promise((resolve, reject) => {
      let blob = new Blob(this.audioChunks, {'type': 'audio/wav'});
      resolve(blob);
    });
  }

  _convertBlobToBuffer(blob: Blob, callback: Function){
    let me = this;
    this.fileReader.onload = () => {
      this.audioContext.decodeAudioData(
        this.fileReader.result, function(buffer: any) {
          /*me.reSample(buffer, 16000, function(newBuffer: any){
            let arrayBuffer = me.convertFloat32ToInt16(
              newBuffer.getChannelData(0));
            callback(arrayBuffer);
          });*/
          let arrayBuffer = me.convertFloat32ToInt16(
            buffer.getChannelData(0));
          console.log(arrayBuffer);
          let newBuffer = me.downsampleBuffer(arrayBuffer, 16000);
          callback(newBuffer);
      });
    };
    this.fileReader.readAsArrayBuffer(blob);
  }

  _onBlobReady(blob: any) {
    let event = new CustomEvent('stream', {
      detail: blob
    });

    window.dispatchEvent(event);
  }


reSample(audioBuffer: any, targetSampleRate: number, onComplete: Function) {
    let channel = audioBuffer.numberOfChannels;
    let samples = audioBuffer.length * targetSampleRate /
    audioBuffer.sampleRate;

    let offlineContext = new OfflineAudioContext(
      channel, samples, targetSampleRate);
    let bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;

    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);

    offlineContext.startRendering().then(function(renderedBuffer){
        console.log('resample');
        onComplete(renderedBuffer);
    });
}

downsampleBuffer(buffer: any, rate:number) {
  // 44100 is what we get from input (at least on Google Chrome) :)
  let sampleRate = 44100;

  if (rate === sampleRate) {
      return buffer;
  }
  if (rate > sampleRate) {
      throw 'downsampling rate show be smaller than original sample rate';
  }
  let sampleRateRatio = sampleRate / rate;
  let newLength = Math.round(buffer.length / sampleRateRatio);
  let result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
      let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer 
        && i < buffer.length; i++) {
          accum += buffer[i];
          count++;
      }
      result[offsetResult] = accum / count;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
  }
  console.log(result);
  return result;
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
