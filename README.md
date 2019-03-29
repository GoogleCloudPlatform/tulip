#### Authentication

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
)
### Setup the Dialogflow Agent

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

# Setup Development Machine

. Rename *env.txt* to *.env* and change the variables.

Install NVM: https://github.com/creationix/nvm and use it to install Node 11:

`nvm i`

Install Yarn: https://yarnpkg.com/en/docs/install

Install dependencies:

`yarn`

. Then run:

`./setup.sh`

`yarn start`

# Build application

`yarn build`


# Deploy to AppEngine Flex

`gcloud app deploy`