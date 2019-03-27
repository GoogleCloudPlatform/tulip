"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var sdk = require('@google-cloud/automl');
dotenv.config();
var AutoMl = (function () {
    function AutoMl() {
        this.projectId = process.env.PROJECT_ID;
        this.location = process.env.ML_MODEL_LOCATION;
        this.model = process.env.ML_MODEL_ID;
    }
    AutoMl.prototype.detect = function (base64Img, callback) {
        this.sessionClient = new sdk.v1beta1.PredictionServiceClient({
            projectId: this.projectId
        });
        var formattedName = this.sessionClient.modelPath(this.projectId, this.location, this.model);
        base64Img = base64Img.replace('data:image/png;base64,', '');
        var payload = {
            image: { imageBytes: base64Img }
        };
        var params = {};
        var request = {
            name: formattedName,
            payload: payload,
            params: params
        };
        this.sessionClient.predict(request)
            .then(function (responses) {
            var response = responses[0];
            callback(response);
        })
            .catch(function (err) {
            console.error(err);
            callback(err);
        });
    };
    return AutoMl;
}());
exports.AutoMl = AutoMl;
exports.automl = new AutoMl();
//# sourceMappingURL=automl.js.map