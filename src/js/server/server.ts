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

import { createServer } from 'http';
import { dialogflow } from './dialogflow';
import { automl } from './automl';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';

const cors = require('cors');

export class App {

    public static readonly PORT:number = 8080;
    private app: express.Application;
    private server: any;
    private io: SocketIO.Server;

    constructor() {
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
        this.app.use(cors());

        let dist = path.join(__dirname, '../');
        this.app.get('/',
            function(req: express.Request, res: express.Response) {
                res.sendFile(path.join(dist, 'index.html'));
        });
        this.app.use(function(req: express.Request, res: express.Response,
            next: express.NextFunction){
            if(req.headers['x-forwarded-proto'] &&
            req.headers['x-forwarded-proto'] === 'http'){
                return res.redirect(
                    ['https://', req.get('Host'), req.url].join('')
                );
            }
            next();
        });
        this.app.use('/', express.static(dist));
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(App.PORT, () => {
            console.log('Running server on port %s', App.PORT);
        });
        let me = this;

        this.io.on('connect', (client: any) => {
            console.log(`Client connected [id=${client.id}]`);
            me.io.emit('setup', `Client connected [id=${client.id}]`);

            client.on('snapshot', (base64Img: string) => {
   
                automl.detect(base64Img, function(results: any){
                    let text = '';
                    if(results && results.payload[0]){
                        let displayName = results.payload[0].displayName;
                        let label = '';

                        switch(displayName.toLowerCase()) {
                            case 'sunflower':
                            case 'sunflowers':
                                label = 'a Sunflower';
                                break;
                            case 'tulip':
                            case 'tulips':
                                label = 'a Tulip';
                                break;
                            case 'rose':
                            case 'roses':
                                label = 'a Rose';
                                break;
                            case 'daisy':
                                label = 'a Daisy';
                                break;
                            case 'cactus':
                                label = 'a Cactus';
                                break;
                            case 'dandelion':
                                label = 'a Dandelion';
                                break;
                            case 'violet':
                                label = 'a Violet';
                                break;
                            case 'aster':
                                label = 'an Aster';
                                break;
                            case 'dahlia':
                                label = 'a Dahlia';
                                break;
                            case 'waterlilly':
                                label = 'a Water Lilly';
                                break;
                            default:
                                label = 'a Flower';
                        }

                        text = `Great, this looks like a ${label}`;
                    } else {
                        text = `Auch, I couldn't detect a flower.`;
                    }
                    console.log(results);
                    // TODO change Dialogflow speech based on results
                    client.emit('imgresult', text);
                });
            });

            client.on('meta', (meta: any) => {
                console.log('Connected client on port %s.', App.PORT);
                dialogflow.setupDialogflow(meta);
            });

            client.on('message', (stream: any, herz: number) => {
                console.log(herz);
                console.log(stream);
                // start streaming from client app to dialogflow
                dialogflow.prepareStream(stream, function(audioBuffer: any){
                    // sending to individual socketid (private message)
                    client.emit('broadcast', audioBuffer);
                    dialogflow.detectStreamCall.end();
                });
                // dialogflow.createAudioFile(stream);
            });
            client.on('stop', () => {
                console.log('finalize stream');
                // stop the client stream, and start detecting
                dialogflow.finalizeStream();
                /*dialogflow.detectIntent(function(audioBuffer: any){
                    // sending to individual socketid (private message)
                    client.emit('broadcast', audioBuffer);
                });*/
            });

            client.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}

export let app = new App();
