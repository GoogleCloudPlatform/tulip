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
    PAGE_INTRO: '.view__intro',
    PAGE_CONTROLLER: '.view__controller',
    PAGE_STATUS: '.view__status',
    START_BUTTON: '.start_button'
};

export class App {
    firstRun = true;
    cameraPaused: boolean;
    microphonePaused: boolean;
    stream: any;
    socket: any;
    startButton: HTMLElement;
    pageController: HTMLElement;
    pageIntro: HTMLElement;
    pageStatus: HTMLElement;

    constructor() {
        this.cameraPaused = false;
        this.microphonePaused = false;
        this.startButton =
        <HTMLElement>document.querySelector(SELECTORS.START_BUTTON);
        this.pageController =
        <HTMLElement>document.querySelector(SELECTORS.PAGE_CONTROLLER);
        this.pageIntro =
        <HTMLElement>document.querySelector(SELECTORS.PAGE_INTRO);
        this.pageStatus =
        <HTMLElement>document.querySelector(SELECTORS.PAGE_STATUS);
    }

    /*
    * Initializes the app and setup the camera.
    */
    init() {
        let me = this;
        this.startButton.addEventListener('click', () => {
            if(this.firstRun){
                me.pageIntro.className = 'view__intro hidden';
                Promise.all([
                    camera.setupCamera().then((value: CameraDimentions) => {
                        camera.setupVideoDimensions(value[0], value[1]);
                    }),
                ]).then(values => {
                    this.firstRun = false;
                    me.pageController.className = 'view__controller';
                    me.listenForSocketEvents();
                }).catch(error => {
                    console.error(error);
                });
            }
        });
    }

    listenForSocketEvents() {
        // only in localhost
        const me = this;
        let url = location.protocol+'//'+location.hostname;
        if(location.hostname === 'localhost' && location.port === '8080'){
        url = location.protocol+'//'+location.hostname+ ':8080';
        }

        me.socket = io(url);
        me.socket.binaryType = 'arraybuffer';

        // socket.io binary
        me.socket.on('broadcast', function(audioBuffer:any) {
            if(audioBuffer) microphone.playOutput(audioBuffer);
        });
        me.socket.on('imgresult', function(text: string) {
            me.pageStatus.innerHTML = text;
        });

        window.addEventListener('cameraPhoto', function(e:CustomEvent) {
            me.socket.emit('snapshot', e.detail);
            me.pageStatus.className = 'view__status';
            me.speak();
        });
    }


    /*
     * Start conversation with Dialogflow SDK
     */
    async speak() {
        let me = this;
        let meta = await microphone.setupMicrophone();
        console.log(meta);
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
        /*
        microphone.setupMicrophone()
        .then(function(meta: any){

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

        }).catch(function(e: any){
            console.log(e);
        }); */
    }
}

export let app = new App();
