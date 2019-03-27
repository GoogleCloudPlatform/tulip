"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.encoding = 'AUDIO_ENCODING_LINEAR_16';
        this.singleUtterance = true;
        this.isInitialRequest = true;
        this.detectStreamCall = null;
    }
    Dialogflow.prototype.setupDialogflow = function (meta) {
        this.sessionId = uuid.v4();
        this.sessionClient = new df.v2beta1.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath(this.projectId, this.sessionId);
        this.sampleRateHertz = meta.sampleHerz;
        this.fileWriter = new wav.FileWriter('temp/' + this.sessionId + '.wav', {
            channels: meta.channels,
            sampleRate: this.sampleRateHertz,
            bitDepth: 16
        });
    };
    Dialogflow.prototype.createAudioFile = function (audio) {
        this.fileWriter.write(audio);
    };
    Dialogflow.prototype.detectIntent = function (cb) {
        return __awaiter(this, void 0, void 0, function () {
            var inputAudio, request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputAudio = fs.createReadStream('temp/' + this.sessionId + '.wav');
                        console.log(inputAudio);
                        request = {
                            session: this.sessionPath,
                            queryInput: {
                                audioConfig: {
                                    sampleRateHertz: this.sampleRateHertz,
                                    audioEncoding: this.encoding,
                                    languageCode: this.languageCode,
                                },
                            },
                            inputAudio: inputAudio,
                            outputAudioConfig: {
                                audioEncoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
                                sampleRateHertz: 48000,
                                synthesizeSpeechConfig: {
                                    voice: {
                                        ssmlGender: 'SSML_VOICE_GENDER_FEMALE'
                                    },
                                    speakingRate: 1.5,
                                    pitch: 7
                                }
                            }
                        };
                        return [4, this.sessionClient.detectIntent(request)];
                    case 1:
                        response = (_a.sent())[0];
                        console.log(response);
                        cb(response);
                        return [2];
                }
            });
        });
    };
    Dialogflow.prototype.prepareStream = function (audio, cb) {
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
                    speakingRate: 1.5,
                    pitch: 7
                }
            }
        };
        this.detectStreamCall = this.sessionClient
            .streamingDetectIntent()
            .on('error', function (e) {
            console.log(e);
        }).on('data', function (data) {
            if (data.recognitionResult) {
                console.log("Intermediate transcript:\n              " + data.recognitionResult.transcript);
            }
            else {
                console.log("Detected intent:");
                console.log(data.outputAudio);
                cb(data.outputAudio);
            }
        }).on('end', function () {
            console.log('on end');
        });
        if (this.isInitialRequest) {
            this.detectStreamCall.write(initialStreamRequest);
        }
        this.fileWriter.write(audio);
    };
    Dialogflow.prototype.finalizeStream = function () {
        console.log('test');
        pump(fs.createReadStream('temp/' + this.sessionId + '.wav'), through2.obj(function (obj, _, next) {
            next(null, { inputAudio: obj });
        }), this.detectStreamCall);
        fs.unlink('temp/' + this.sessionId + '.wav', function (err) {
            if (err)
                throw console.log(err);
            console.log('Audio file was deleted');
        });
    };
    return Dialogflow;
}());
exports.Dialogflow = Dialogflow;
exports.dialogflow = new Dialogflow();
//# sourceMappingURL=dialogflow.js.map