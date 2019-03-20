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

            client.on('meta', (meta: any) => {
                console.log('Connected client on port %s.', App.PORT);
                console.log(meta);
                dialogflow.setupDialogflow(meta);
            });

            client.on('message', (stream: any, herz: number) => {
                dialogflow.detectStream(stream, function(audioBuffer: any){
                    console.log(audioBuffer);
                    // me.io.emit('broadcast', audioBuffer);
                    me.io.emit('broadcast', audioBuffer);
                });
            });
            client.on('stop', () => {
                dialogflow.stopStream();
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
