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
        this.isResult = false;
    }
    Dialogflow.prototype.setupDialogflow = function (meta) {
        this.sessionClient = new df.v2beta1.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
        this.sampleRateHertz = meta.sampleHerz;
        this.fileWriter = new wav.FileWriter('temp/' + this.sessionId + '.wav', {
            channels: meta.channels,
            sampleRate: this.sampleRateHertz,
            bitDepth: 16
        });
    };
    Dialogflow.prototype.detectStream = function (audio, cb) {
        var _this = this;
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
            },
            outputAudioConfig: {
                audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
                sampleRateHertz: 48000,
                synthesizeSpeechConfig: {
                    voice: {
                        ssmlGender: 'SSML_VOICE_GENDER_FEMALE'
                    },
                    speakingRate: 1.8,
                    pitch: 8
                }
            }
        };
        var me = this;
        var detectStream = this.sessionClient
            .streamingDetectIntent()
            .on('error', function (e) {
            console.log(e);
        }).on('data', function (data) {
            if (data.recognitionResult) {
            }
            else {
                console.log(me.isResult);
                console.log("Detected intent:");
                console.log(data);
                _this.createAudio(data.outputAudio);
                cb(data.outputAudio);
                me.isResult = true;
            }
        });
        if (this.isInitialRequest) {
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
    Dialogflow.prototype.createAudio = function (audioBuffer) {
        fs.writeFile('temp/results.wav', audioBuffer, function () {
            console.log('done');
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