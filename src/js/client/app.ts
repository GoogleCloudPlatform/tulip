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

let ss = require('socket.io-stream');

interface CameraDimentions {
    [index: number]: number;
}

export class App {
    firstRun = true;
    ss = false;
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
        if(this.firstRun){
            Promise.all([
                camera.setupCamera().then((value: CameraDimentions) => {
                camera.setupVideoDimensions(value[0], value[1]);
                }),
            ]).then(values => {
                this.firstRun = false;
                this.detectImage();
            }).catch(error => {
                console.error(error);
            });

            if(!this.ss) {
                console.log('socket binary');
                // socket.io binary
                this.socket.on('audio', function(audioObj:any) {
                    console.log('Client connected over WebSockets');
                });
            } else {
                console.log('socket io-stream');
                // socket.io-stream
                this.stream = ss.createStream();
                ss(this.socket).on('audio', function(stream:any){
                    console.log('websockets connected as stream');
                });
            }
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
        this.speak();
    }

    /*
     * Start conversation with Dialogflow SDK
     */
    speak() {
        console.log('start speaking');
        let me = this;
        microphone.setupMicrophone(this.stream)
        .then(function(audioEl:HTMLElement){
            console.log(me.stream);
            console.log(me);

            window.addEventListener('stop', function(e:CustomEvent) {
                if(!me.ss) {
                    me.socket.emit('stop');
                } else {
                    ss(me.socket).emit('stop');
                }
            });

            window.addEventListener('processFile', function(e:CustomEvent) {
                let audioData = e.detail.audioData;
                let params = e.detail.params;

                if(!me.ss) {
                    me.socket.emit('recognise', audioData, params);
                } else {
                    ss(me.socket).emit('recognise', audioData, params);
                }
            });

            window.addEventListener('audio', function(e:CustomEvent) {
                let audio = e.detail; // AudioBuffer
                if(!me.ss) {
                    console.log('socket binary');
                    // socket.io binary
                    me.socket.on('returnaudio', function(audioObj:any) {
                        console.log('Client connected over WebSockets');
                    });

                    // send mic audio to server
                    me.socket.emit('message', audio);

                } else {
                    console.log('socket io-stream');
                    // socket.io-stream
                    me.stream = ss.createStream();
                    ss(me.socket).on('returnaudio', function(stream:any){
                        console.log('websockets connected as stream');
                    });

                    // send mic audio to server via streams
                    ss(me.socket).emit('message', audio);
                }
            });


        }).catch(microphone.handleErrors);
    }
}

export let app = new App();
