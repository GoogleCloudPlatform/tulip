## How to set up a conversation with your flower using DialogFlow

It is our pleasure to announce Google Tulip, our machine learning technology to improve the profitability of Dutch agriculture and the well-being of Dutch cash crops. But we also wanted to provide people with the possibility to create conversations with their own flowers.

This tutorial helps you jump straight into the conversational chatbot that we created for Google Tulip using [DialogFlow](https://dialogflow.com/docs). We chose DialogFlow because it allows us to use the same Agent and logic to power both our webapp and the published Action On Google / Google Assistant.

If you aren't familiar with DialogFlow, we recommend to take a look at [creating a Dialogflow account](https://dialogflow.com/docs/getting-started/create-account) and then [your first Dialogflow Agent and Intents](https://dialogflow.com/docs/getting-started/first-agent), to get a feeling of how a Agent and Intents work.


## Setup the Dialogflow Agent

1. In the Google Cloud console, search for Dialogflow API, and ensure it is enabled.

2. On the left hand side, select **Dialogflow Agent**

3. Click on **Open or Create Agent at dialogflow.com**

4. Select your google account

5. Accept the terms & conditions

6. Give your agent a name

7. For language choose: **English**

8. Choose time zone

9. Click **Create**
 
### Configure Dialogflow

1. In the left hand menu, click the **Upgrade button**

1. Choose **Enterprise Edition Essentials**

1. Click on the **gear** icon, in the left menu, next to your project name.

2. Enter your agent description

3. Click: **Enable beta features & APIs**
   Click **Log In Google Cloud**

4. Click **Save**

5. Click on **Export & Import**

6. On your hard drive navigate to *dialogflow* folder in the root of this project, and zip this folder 

7. Back in DialogFlow UI, click on **Import from Zip** in the Dialogflow settings screen to import the zip file. This contains some the example chatbot dialogs called Intents that we used to build our Tulip Translator

## Test the DialogFlow agent

You can test out your agent by using the panel on the right-hand side of the DialogFlow UI. If you are feeling really ambitious, you might even try it in the [Google Assistant Simulator](https://console.dialogflow.com/api-client/#/assistant_preview) and eventually launch it as an Action on Google.

One thing we learned while launching as an Action Google: You can't leave the mic open without prompting the user for a clear followup question. This changes your conversational tone quite a bit, and is why you see so many of our Intents prompt the user with followup questions. 

