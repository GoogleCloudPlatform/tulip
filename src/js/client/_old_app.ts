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

            //this.stream = this.socket.createStream();
            this.stream = ss.createStream();
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
        microphone.setupRecorder(this.stream)
        .then(function(audioEl:HTMLElement){
            window.addEventListener('stream', function(e:CustomEvent) {
                console.log('Stream event');
                let audio = e.detail;
                console.log(audio);
                // me.socket.emit('message', audio);
                ss(me.socket).emit('message', me.stream, audio);

                // let bufView = new Uint8Array(e.detail);
                    // socket.emit('message', bufView);
                    // console.log(bufView);

                 // let file = e.target.files[0];
                
                //console.log(audio);
                
                //let bufView = new Uint8Array(audio);
                //console.log(bufView);
                //socket.binary(true).emit('message', bufView);
                
                // let uInt8Array = new Uint8Array(audio);
                // let arrayBuffer = uInt8Array.buffer;
                // var blob = new Blob([arrayBuffer]);
                // lett file = e.target.files[0];
                //let bufView = new Uint8Array(audio);
                //ss.createBlobReadStream(bufView).pipe(stream);
                //ss(socket).emit('message', stream, bufView);
            });
        }).catch(microphone.handleErrors);
    }
}

export let app = new App();
