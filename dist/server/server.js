"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var dialogflow_1 = require("./dialogflow");
var automl_1 = require("./automl");
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
        this.server.listen(App.PORT, function () {
            console.log('Running server on port %s', App.PORT);
        });
        var me = this;
        this.io.on('connect', function (client) {
            console.log("Client connected [id=" + client.id + "]");
            me.io.emit('setup', "Client connected [id=" + client.id + "]");
            client.on('snapshot', function (base64Img) {
                automl_1.automl.detect(base64Img, function (results) {
                    var text = '';
                    if (results && results.payload[0]) {
                        var displayName = results.payload[0].displayName;
                        var label = '';
                        switch (displayName.toLowerCase()) {
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
                        text = "Great, this looks like a " + label;
                    }
                    else {
                        text = "Auch, I couldn't detect a flower.";
                    }
                    console.log(results);
                    client.emit('imgresult', text);
                });
            });
            client.on('meta', function (meta) {
                console.log('Connected client on port %s.', App.PORT);
                dialogflow_1.dialogflow.setupDialogflow(meta);
            });
            client.on('message', function (stream, herz) {
                dialogflow_1.dialogflow.detectStream(stream, function (audioBuffer) {
                    client.emit('broadcast', audioBuffer);
                });
            });
            client.on('stop', function () {
                dialogflow_1.dialogflow.stopStream();
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