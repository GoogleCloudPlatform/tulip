"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var path = require("path");
var App = (function () {
    function App() {
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
    }
    App.prototype.createApp = function () {
        this.app = express();
        var dist = path.join(__dirname, '..');
        this.app.get('/', function (req, res) {
            res.sendFile(path.join(dist, 'index.html'));
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
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', App.PORT);
            socket.on('message', function (m) {
                console.log('[server](message): %s', JSON.stringify(m));
                _this.io.emit('message', m);
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    App.prototype.getApp = function () {
        return this.app;
    };
    App.prototype.defaultRoute = function (req, res) {
        res.sendFile('index.html', {
            root: path.join(__dirname, 'dist')
        });
    };
    App.PORT = 8080;
    return App;
}());
exports.App = App;
exports.app = new App();
//# sourceMappingURL=server.js.map