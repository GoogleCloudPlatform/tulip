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

export class App {
    firstRun = true;
    flowers:  Array<HTMLImageElement>;
    cameraPaused: boolean;
    microphonePaused: boolean;
    stream: any;
    socket: any;

    constructor() {
        this.flowers = [];
        this.cameraPaused = false;
        this.microphonePaused = false;

        this.socket = io();
        this.socket.binaryType = 'arraybuffer';
    }

    /*
    * Initializes the app and setup the camera.
    */
    init() {
        let me = this;
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

            // socket.io binary
            this.socket.on('broadcast', function(audioBuffer:any) {
                console.log('Client connected over WebSockets');
                console.log(audioBuffer);
                microphone.playOutput(audioBuffer);
            });
        }
    }

    /*
     * Make image and detect photo with Vision API
     */
    detectImage() {
        // Make snapshot
        this.flowers.push(camera.snapshot());
        console.log(this.flowers[0].src);
        // TODO VISION API
            // AFTER DETECTION OPEN MICROPHONE
    }

    /*
     * Start conversation with Dialogflow SDK
     */
    speak() {
        let me = this;
        microphone.setupMicrophone()
        .then(function(meta: any){

            me.socket.emit('meta', meta);

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
