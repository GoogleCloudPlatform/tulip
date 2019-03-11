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

// import * as df from 'dialogflow';
const df = require('dialogflow').v2beta1;
import * as dotenv from "dotenv";
import * as uuid from "uuid";

const fs = require('fs');
const wav = require('wav');
const pump = require('pump');
const through2 = require('through2');

const fileWriter = new wav.FileWriter('output.wav', {
  channels: 1,
  sampleRate: 48000,
  bitDepth: 16
});

dotenv.config();


export class Dialogflow {
    private sessionClient: any;
    private sessionPath: any;
    private projectId: string;
    private sessionId: string;
    private languageCode: string;
    private encoding: string;
    private sampleRateHertz: Number;
    private singleUtterance: Boolean;
    private isInitialRequest: Boolean;
    // private audio: any;

    constructor() {
        this.languageCode = 'en-US';
        this.projectId = process.env.PROJECT_ID;
        this.sessionId = uuid.v4();
        this.sampleRateHertz = 48000;
        this.encoding = 'AUDIO_ENCODING_LINEAR_16';
        this.singleUtterance = true;
        this.isInitialRequest = true;

        this.setupDialogflow();
        console.log(this.encoding);
    }

    public setupDialogflow() {
        this.sessionClient = new df.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath(
            this.projectId, this.sessionId);

        console.log(this.projectId, this.sessionId);
        console.log(this.sessionClient);
    }


    public convertDataURIToBinary(dataURI: any) {
      let buf = Buffer.from(dataURI, 'base64');
      return buf;
    }

    public detectStream(audio: any){
      
      // this.audio = audio;
      // console.log(this.audio);


      /*
      // stream
      const readableInstanceStream = new Readable({
        read() {
          this.push(audio);
          this.push(null);
        }
      });*/
      // console.log(readableInstanceStream);
      // console.log(this.projectId, this.sessionId);
      // console.log(this.sessionPath);

      // audioStream.write(readableInstanceStream);

      const initialStreamRequest = {
        session: this.sessionPath,
        queryParams: {
          session: this.sessionClient.sessionPath(
              this.projectId, this.sessionId),
        },
        queryInput: {
          audioConfig: {
            sampleRateHertz: this.sampleRateHertz,
            audioEncoding: this.encoding,
            languageCode: this.languageCode,
          },
          singleUtterance: this.singleUtterance
        }
      };

      // Create a stream for the streaming request.
      const detectStream = this.sessionClient
      .streamingDetectIntent()
        .on('error', (e: any) => {
          console.log(e);
        }).on('data', (data: any) => {
          console.log(data);

          if (data.recognitionResult) {
            console.log(
              `Intermediate transcript:
              ${data.recognitionResult.transcript}`
            );
          } else {
            console.log(`Detected intent:`);
            console.log(data.queryResult);
          }
        });

        detectStream.write(initialStreamRequest);

        // Write the initial stream request to config for audio input.
        if(this.isInitialRequest) {
          console.log(this.isInitialRequest);
          console.log('only once');
          console.log(initialStreamRequest);
          //detectStream.write(initialStreamRequest);
        }

        fileWriter.write(audio);

        pump(
          fs.createReadStream('output.wav'),
          // Format the audio stream into the request format.
          through2.obj((obj:any, _:any, next:any) => {
            next(null, {inputAudio: obj});
          }),
          detectStream
        );
    }

    public stopStream() {
      fileWriter.end();
      console.log('stop');
    }

    public detectIntent(audio: any) {

        const request = {
          session: this.sessionPath,
          queryInput: {
            audioConfig: {
              audioEncoding: 'AUDIO_ENCODING_LINEAR_16',
              sampleRateHertz: 16000,
              languageCode: this.languageCode,
            },
          },
          inputAudio: audio
        };

        this.sessionClient.detectIntent(request).then(function(result:any){
          console.log(result);
        }).catch(function(e:any) {
          console.log(e);
        });
      }
      
}

export let dialogflow = new Dialogflow();
