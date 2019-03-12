"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var dialogflow_1 = require("./dialogflow");
var express = require("express");
var socketIo = require("socket.io");
var path = require("path");
var cors = require('cors');
var App = (function () {
    function App() {
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
        this.recording = true;
    }
    App.prototype.createApp = function () {
        this.app = express();
        this.app.use(cors());
        var dist = path.join(__dirname, '../');
        this.app.get('/', function (req, res) {
            res.sendFile(path.join(dist, 'index.html'));
        });
        this.app.use(function (req, res, next) {
            if (req.headers['x-forwarded-proto'] &&
                req.headers['x-forwarded-proto'] === 'http') {
                return res.redirect(['https://', req.get('Host'), req.url].join(''));
            }
            next();
        });
        this.app.use('/', express.static(dist));
    };
    App.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    App.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    App.prototype.listen = function () {
        var _this = this;
        this.server.listen(App.PORT, function () {
            console.log('Running server on port %s', App.PORT);
        });
        var me = this;
        this.io.on('connect', function (client) {
            client.on('meta', function (meta) {
                console.log('Connected client on port %s.', App.PORT);
                console.log(meta);
                dialogflow_1.dialogflow.setupDialogflow(meta);
            });
            client.on('message', function (stream, herz) {
                if (_this.recording) {
                    dialogflow_1.dialogflow.detectStream(stream, function (audioBuffer) {
                        console.log(audioBuffer);
                        me.io.emit('broadcast', audioBuffer);
                    });
                }
            });
            client.on('stop', function () {
                dialogflow_1.dialogflow.stopStream();
                _this.recording = false;
            });
            client.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    App.prototype.getApp = function () {
        return this.app;
    };
    App.PORT = 8080;
    return App;
}());
exports.App = App;
exports.app = new App();
//# sourceMappingURL=server.js.map