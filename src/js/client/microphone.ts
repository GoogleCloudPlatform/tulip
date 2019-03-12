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
    outputChunks: Array<any>;
    mediaRecorder: any;
    fileReader: any;
    audioContext: AudioContext;
    meta: any;
    source: MediaStreamAudioSourceNode;
    scriptProcessor: ScriptProcessorNode;

    constructor() {
        this.fileReader = new FileReader();
        this.audioChunks = [];
        this.outputChunks = [];
        this.meta = {};
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
  async setupMicrophone() {
    let me = this;
    me.audioContext = new AudioContext();
    me.meta.sampleHerz = me.audioContext.sampleRate;
    me.meta.channels = me.audioContext.destination.numberOfInputs;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(s: MediaStream) {
          me.mediaRecorder = new MediaRecorder(s);
          me.getMicStream(s);

          me.mediaRecorder.addEventListener('start', (e:any) => {
            me.audioChunks = [];
            me.outputChunks = [];

            let event = new CustomEvent('start', {
              detail: 'start'
            });
            window.dispatchEvent(event);

            me.source.connect(me.scriptProcessor);
            me.scriptProcessor.connect(me.audioContext.destination);
          });

          me.mediaRecorder.addEventListener('dataavailable', (e:any) => {
            me.audioChunks.push(e.data);
          });

          me.mediaRecorder.addEventListener('stop', (e:any) => {
            // stop the script processors
            me.source.disconnect();
            me.scriptProcessor.disconnect();

            // create a blob from the audio chunks
            // so we can play the recorded voice in the player
            /*let blobData = new Blob(me.audioChunks, {
              'type': 'audio/ogg;codecs=opus'
            });
            console.log('!');
            console.log(window.URL.createObjectURL(blobData));
            // attach the audio to the player
            me.audioElement.src = window.URL.createObjectURL(blobData);*/
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
      resolve(me.meta);
    });
  }

  getMicStream(s: any){
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
   * When working with Dialogflow and Dialogflow matched an intent,
   * and returned an audio buffer. Play this output.
   */
  playOutput(arrayBuffer:any){
    let me = this;
    this.audioContext.decodeAudioData(arrayBuffer).then(
      function(audioBuffer: AudioBuffer){
        const sourceNode = me.audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(me.audioContext.destination);
        sourceNode.start();
    });
  }


  handleErrors(errors: any){
      console.log(errors);
  }

  convertFloat32ToInt16(buffer:any){
      let l = buffer.length;
      let buf = new Int16Array(l);
      while (l--) {
          buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
      }
      return buf.buffer;
  }
  convertInt16ToFloat32(buffer: any) {
    let l = buffer.length;
    let output = new Float32Array(buffer.length-0);
    for (let i = 0; i < l; i++) {
        let int = buffer[i];
        // If the high bit is on, then it is a negative number,
        // and actually counts backwards.
        let float = (int >= 0x8000) ? -(0x10000 - int) / 0x8000 : int / 0x7FFF;
        output[i] = float;
    }
    return output;
  }
}

export let microphone = new Microphone();
