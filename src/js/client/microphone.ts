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

    constructor() {
        this.audioChunks = [];
        this.audioElement =
        <HTMLAudioElement>document.querySelector(SELECTORS.MIC_ELEMENT);
        this.recordButton =
        <HTMLElement>document.querySelector(SELECTORS.MIC_RECORD_BUTTON);
        this.stopButton =
        <HTMLElement>document.querySelector(SELECTORS.MIC_STOP_BUTTON);
    }

  /**
   * Requests access to the microphone and return a Promise
   *
   * @async
   * @returns {Promise<>}
   */
  async setupMicrophone() {

    this.recordButton.addEventListener('click', () => {
      // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
       /* alert(navigator.mediaDevices.getUserMedia);
        const stream = await navigator.mediaDevices.getUserMedia({
          'audio': true,
          'video': true
        });
        (<any>window).stream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = function(blob: any) {
            microphone.audioElement.src = URL.createObjectURL(blob.data);
        };
        return new Promise(resolve => {
          this.audioElement.onloadedmetadata = () => {
            resolve(this.audioElement);
          };
        });*/
      // }
      // return null;

      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        // Set record to <audio> when recording will be finished
        this.mediaRecorder.addEventListener('dataavailable', (e:any) => {
          microphone.audioElement.src = URL.createObjectURL(e.data);
        });
        // Start recording
        this.mediaRecorder.start();
      });

        microphone.startRecording();
    });
    this.stopButton.addEventListener('click', () => {
        microphone.stopRecording();
    });
  }

  startRecording(){
    this.mediaRecorder.start();
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

}

export let microphone = new Microphone();