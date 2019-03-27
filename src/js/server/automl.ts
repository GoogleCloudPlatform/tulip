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

import * as dotenv from 'dotenv';
const sdk = require('@google-cloud/automl');

dotenv.config();

interface PayloadImage {
    imageBytes: string;
}

interface Payload {
    image: PayloadImage;
}

export class AutoMl {
    private sessionClient: any;
    private projectId: string;
    private location: string;
    private model: string;

    constructor() {
        this.projectId = process.env.PROJECT_ID;
        this.location = process.env.ML_MODEL_LOCATION;
        this.model = process.env.ML_MODEL_ID;
    }

    /*
     * Setup AutoML
     */
    public detect(base64Img: string, callback: Function) {
        this.sessionClient = new sdk.v1beta1.PredictionServiceClient({
            projectId: this.projectId
        });

        const formattedName = this.sessionClient.modelPath(
            this.projectId,
            this.location,
            this.model
        );
        
        base64Img = base64Img.replace('data:image/png;base64,', '');

        let payload: Payload = {
            image:  {imageBytes: base64Img}
        };
        const params = {};

        const request = {
          name: formattedName,
          payload: payload,
          params: params
        };

        this.sessionClient.predict(request)
        .then(function(responses: any){
            const response = responses[0];
            callback(response);
          })
          .catch(function(err: any){
            console.error(err);
            callback(err);
          });

    }
}

export let automl = new AutoMl();
