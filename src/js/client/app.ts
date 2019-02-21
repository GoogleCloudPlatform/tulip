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
interface CameraDimentions {
    [index: number]: number;
}

export class App {
    firstRun = true;
    flowers:  Array<HTMLImageElement>;
    cameraPaused: boolean;
    microphonePaused: boolean;

    constructor() {
        this.flowers = [];
        this.cameraPaused = false;
        this.microphonePaused = false;
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
        microphone.setupMicrophone().then(function(){
            // Get URL Stream as String
            const stream = microphone.getDataURL();
            const socket = io();

            console.log(stream);
            socket.emit('message', stream);
            // Submit this string to Dialogflow SDK
        }).catch(microphone.handleErrors);
    }

}

export let app = new App();
