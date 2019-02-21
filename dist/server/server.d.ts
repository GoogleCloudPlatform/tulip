/// <reference types="express" />
import * as express from 'express';
export declare class App {
    static readonly PORT: number;
    private app;
    private server;
    private io;
    constructor();
    private createApp();
    private createServer();
    private sockets();
    private listen();
    getApp(): express.Application;
    defaultRoute(req: express.Request, res: express.Response): void;
}
export declare let app: App;
