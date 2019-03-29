[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Tulip Translator


**Disclaimer: This example is made by Lee Boonstra, Customer Engineer @ Google Cloud. Written code can be used as a baseline, it's not meant for production usage.**

**Copyright 2019 Google LLC. This software is provided as-is, without warranty or representation for any use or purpose. Your use of it is subject to your agreements with Google.**  

#

Always been curious to learn what your plants and flowers would say if they could talk?  With Tulip Translator you can have a mock conversation with your favorite flower. But beware, it has an attitude :)

1. Build the code, and deploy it on Google App Engine Flex.

2. Point your camera at a flower, and snap a picture!

3. The Google Cloud AutoML Vision model, will detect your flower, and return the results on the screen.

4. Get ready! Now you can start your conversation.

## Powered by Google Cloud

This experiment, showcases the power of Google Cloud.
The following building blocks have been used:

* AutoML Vision with Flower Dataset [(see tutorial)](https://github.com/GoogleCloudPlatform/tulip/blob/master/tutorial_automl.md)
* Dialogflow Enterprise with STT & TTS
* AppEngine Flex

### Details

This application is written in JavaScript for Node.js and browser. The **src/client** app
is written in TypeScript, and talks via WebSockets to the Node.js server **src/server**.
The client application enables the Camera & Microphone throught HTML5 browser APIs (`navigator.getUserMedia`).
The server application has the integration with the AutoML and Dialogflow SDKs.

## Authentication

Authentication is typically done through `Application Default Credentials`,
which means you do not have to change the code to authenticate as long as
your environment has credentials. You have a few options for setting up
authentication:

1. When running locally, use the `Google Cloud SDK`

        gcloud auth application-default login


    Note that this command generates credentials for client libraries. To authenticate the CLI itself, use:
    
        gcloud auth login

2. You can create a `Service Account key file`. 
   You need to create a Service Account key file. This file can be used to authenticate to Google Cloud Platform services.

   This file can be used to
   authenticate to Google Cloud Platform services from any environment. To use
   the file, set the ``GOOGLE_APPLICATION_CREDENTIALS`` environment variable to
   the path to the key file, for example:

        export GOOGLE_APPLICATION_CREDENTIALS=~/Documents/keys/project-shunkaen.json

* [Application Default Credentials]( https://cloud.google.com/docs/authentication#getting_credentials_for_server-centric_flow)
* [Additional scopes](https://cloud.google.com/compute/docs/authentication#using)
* [Service Account key file](https://developers.google.com/identity/protocols/OAuth2ServiceAccount#creatinganaccount)


## Setup the Dialogflow Agent

1. (optional) In the cloud console, search for Dialogflow API

2. On the left hand side, select **Dialogflow Agent**

3. Click on **Open or Create Agent at dialogflow.com**

4. Select your google account

5. Allow the terms & conditions

6. Give your agent the name **Project-Shunkaen**

7. For language choose: **English**

8. For time zone choose: **Europe/Madrid**

9. Click **Create**
 
### Configure Dialogflow

1. In the left hand menu, click the **Upgrade button**

1. Choose **Enterprise Edition Essentials**

1. Click on the **gear** icon, in the left menu, next to your project name.

2. Enter the following agent description: **Project Shunkaen**

3. Click: **Enable beta features & APIs**
   Click **Log In Google Cloud**

4. Click **Save**

5. Click on **Export & Import**

6. On your hard drive navigate to *dialogflow* zip this folder, and then **Import from Zip** in the Dialogflow settings screen. These are some example chatbot dialogs.

## Setup Development Machine

. Rename *env.txt* to *.env* and change the variables.

Install NVM: https://github.com/creationix/nvm and use it to install Node 11:

`nvm i`

Install Yarn: https://yarnpkg.com/en/docs/install

Install dependencies:

`yarn`

. Then run:

`./setup.sh`

First build the TypeScript files to JS:

`yarn build`

Start the application, it runs on port: 8080

`yarn start`


## Deploy to AppEngine Flex

`gcloud app deploy`


## Debug info

To help with debugging the deployment you can SSH into your instance through the dashboard:
https://console.cloud.google.com/appengine/instances

From there you can run `docker ps` to find the ID of your container.

Then run something like `docker exec -i -t 04473eaa2bb4 /bin/bash`. Make sure to replace the ID with the ID of your container.

#

**Disclaimer: This example is made by Lee Boonstra, Customer Engineer @ Google Cloud. Written code can be used as a baseline, it's not meant for production usage.**

**Copyright 2019 Google LLC. This software is provided as-is, without warranty or representation for any use or purpose. Your use of it is subject to your agreements with Google.**  
