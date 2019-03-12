"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var df = require("dialogflow");
var dotenv = require("dotenv");
var uuid = require("uuid");
var fs = require("fs");
var pump = require("pump");
var through2 = require("through2");
var wav = require('wav');
dotenv.config();
var Dialogflow = (function () {
    function Dialogflow() {
        this.languageCode = 'en-US';
        this.projectId = process.env.PROJECT_ID;
        this.sessionId = uuid.v4();
        this.sampleRateHertz = 48000;
        this.encoding = 'AUDIO_ENCODING_LINEAR_16';
        this.singleUtterance = true;
        this.isInitialRequest = true;
        this.fileWriter = new wav.FileWriter('output.wav', {
            channels: 1,
            sampleRate: this.sampleRateHertz,
            bitDepth: 16
        });
        this.setupDialogflow();
    }
    Dialogflow.prototype.setupDialogflow = function () {
        this.sessionClient = new df.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
    };
    Dialogflow.prototype.detectStream = function (audio) {
        var initialStreamRequest = {
            session: this.sessionPath,
            queryParams: {
                session: this.sessionClient.sessionPath(this.projectId, this.sessionId),
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
        var detectStream = this.sessionClient
            .streamingDetectIntent()
            .on('error', function (e) {
            console.log(e);
        }).on('data', function (data) {
            console.log(data);
            if (data.recognitionResult) {
                console.log("Intermediate transcript:\n              " + data.recognitionResult.transcript);
            }
            else {
                console.log("Detected intent:");
                console.log(data.queryResult);
            }
        });
        detectStream.write(initialStreamRequest);
        if (this.isInitialRequest) {
            console.log(this.isInitialRequest);
            console.log('only once');
            console.log(initialStreamRequest);
        }
        this.fileWriter.write(audio);
        pump(fs.createReadStream('output.wav'), through2.obj(function (obj, _, next) {
            next(null, { inputAudio: obj });
        }), detectStream);
    };
    Dialogflow.prototype.stopStream = function () {
        this.fileWriter.end();
        console.log('stop');
    };
    Dialogflow.prototype.detectIntent = function (audio) {
        var request = {
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
        this.sessionClient.detectIntent(request).then(function (result) {
            console.log(result);
        }).catch(function (e) {
            console.log(e);
        });
    };
    return Dialogflow;
}());
exports.Dialogflow = Dialogflow;
exports.dialogflow = new Dialogflow();
//# sourceMappingURL=dialogflow.js.map