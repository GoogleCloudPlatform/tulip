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
        this.encoding = 'AUDIO_ENCODING_LINEAR_16';
        this.singleUtterance = true;
        this.isInitialRequest = true;
    }
    Dialogflow.prototype.setupDialogflow = function (meta) {
        this.sessionClient = new df.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
        this.sampleRateHertz = meta.sampleHerz;
        this.fileWriter = new wav.FileWriter('temp/' + this.sessionId + '.wav', {
            channels: meta.channels,
            sampleRate: this.sampleRateHertz,
            bitDepth: 16
        });
    };
    Dialogflow.prototype.detectStream = function (audio, cb) {
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
            if (data.recognitionResult) {
            }
            else {
                console.log("Detected intent:");
                cb(data);
            }
        });
        if (this.isInitialRequest) {
            console.log(this.isInitialRequest);
            detectStream.write(initialStreamRequest);
        }
        this.fileWriter.write(audio);
        pump(fs.createReadStream('temp/' + this.sessionId + '.wav'), through2.obj(function (obj, _, next) {
            next(null, { inputAudio: obj });
        }), detectStream);
    };
    Dialogflow.prototype.stopStream = function () {
        fs.unlink('temp/' + this.sessionId + '.wav', function (err) {
            if (err)
                throw console.log(err);
            console.log('Audio file was deleted');
        });
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