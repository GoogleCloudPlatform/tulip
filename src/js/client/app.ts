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

import {camera} from './camera';
import {microphone} from './microphone';
import * as io from 'socket.io-client';

interface CameraDimentions {
    [index: number]: number;
}

const SELECTORS = {
    START_ELEMENT: '.start_button',
    PAGE_INTRO: '.page_intro',
    PAGE_CONTROLLER: '.page_controller'
};

export class App {
    firstRun = true;
    flowers:  Array<HTMLImageElement>;
    cameraPaused: boolean;
    microphonePaused: boolean;
    stream: any;
    socket: any;
    startButton: HTMLElement;
    pageController: HTMLElement;
    pageIntro: HTMLElement;

    constructor() {
        this.flowers = [];
        this.cameraPaused = false;
        this.microphonePaused = false;

        this.startButton =
        <HTMLElement>document.querySelector(SELECTORS.START_ELEMENT);
        this.pageController =
        <HTMLElement>document.querySelector(SELECTORS.PAGE_CONTROLLER);
        this.pageIntro =
        <HTMLElement>document.querySelector(SELECTORS.PAGE_INTRO);
    }

    /*
    * Initializes the app and setup the camera.
    */
    init() {
        let me = this;
        this.startButton.addEventListener('click', () => {
            me.pageIntro.style.display = 'none';
            me.pageController.style.display = 'block';

            if(this.firstRun){
                Promise.all([
                    camera.setupCamera().then((value: CameraDimentions) => {
                        camera.setupVideoDimensions(value[0], value[1]);
                        me.speak();
                    }),
                ]).then(values => {
                    this.firstRun = false;
                    this.detectImage();
                }).catch(error => {
                    console.error(error);
                });
            }
        });


    // only in localhost
    let url = location.protocol+'//'+location.hostname;
    if(location.hostname === 'localhost' && location.port === '8080'){
      url = location.protocol+'//'+location.hostname+ ':8080';
    }

    me.socket = io(url);
    me.socket.binaryType = 'arraybuffer';

    // socket.io binary
    me.socket.on('broadcast', function(audioBuffer:any) {
        microphone.playOutput(audioBuffer);
    });

    }

    /*
     * Make image and detect photo with Vision API
     */
    detectImage() {
        // Make snapshot
        this.flowers.push(camera.snapshot());
        this.socket.emit('snapshot', this.flowers[0].src);
    }

    /*
     * Start conversation with Dialogflow SDK
     */
    speak() {
        let me = this;
        microphone.setupMicrophone()
        .then(function(meta: any){
            console.log('...');
            // event fired every time a new client connects:
            meta.socket = me.socket.id;
            window.addEventListener('start', function(e:CustomEvent) {
                me.socket.emit('meta', meta);
            });

            window.addEventListener('stop', function(e:CustomEvent) {
                me.socket.emit('stop');
            });

            window.addEventListener('audio', function(e:CustomEvent) {
                let audio = e.detail; // ArrayBuffer
                // socket.io binary
                me.socket.on('returnaudio', function(audioObj:any) {
                    console.log('Client connected over WebSockets');
                });

                // send mic audio to server
                me.socket.emit('message', audio);
            });

        }).catch(microphone.handleErrors);
    }
}

export let app = new App();
