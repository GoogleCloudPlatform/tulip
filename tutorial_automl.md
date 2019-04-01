## How to train your own flower classification model using Google Cloud AutoML

It is our pleasure to announce Google Tulip, our machine learning technology to improve the profitability of Dutch agriculture and the well-being of Dutch cash crops. But we also wanted to provide people with the possibility to train their own model using Google Cloud AutoML Technology. 

This tutorial helps you to get started with training and deploying your own Flower Classifier using Google Cloud [AutoML](https://cloud.google.com/automl/). 

If you want to start with a more detailed tutorial, then its best to follow this more detailed [AutoML](https://cloud.google.com/vision/automl/docs/tutorial) tutorial on our website. 

### How to get started with training and deploying your own flower detector. 
To train our own AutoML model you first need to get the data. The data is stored in a bucket on [Google Cloud Storage](https://cloud.google.com/storage/). Download the zip file from the [url](https://storage.googleapis.com/flower-automl/flowers.zip). This will download the flower.zip file to your local device. 

### Go to AutoML Vision 
Go to your Google cloud [console](https://console.cloud.google.com). Go to the navigation menu on the top left. This will show you all Google Cloud services that are available. Navigate to the Artificial Intelligence products and select vision. Then select AutoML Image Classification. You can also navigate to [AutoML Vision](http://console.cloud.google.com/vision/) directly (if you have a [Google Cloud Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)). 

### Upload the data
You have made it to the AutoML Vision UI! You rock :) You will now see the dataset tab. Please select 'new dataset'. Then select 'create dataset'. AutoML Vision will now upload the data to your Google Cloud Project. Uploading can take a while. If you see a notification saying duplicate files detected you can select 'dismiss'. 

### Train your first model
Now navigate to the train tab and select 'start training'. AutoML Vision will now start training the model! Of course this takes some time. So get yourself a coffee and make sure you plants get some water. 

## Evaluate your model
Now its time to check how your model is performing. In the evaluate tab. Have a look at the precision and recall as shown below. If you scroll down you can also see the confusion matrix.
![Model Performance](https://github.com/Huize501/Images/blob/master/Screen%20Shot%202019-04-01%20at%202.37.46%20PM.png "model performance")


### Test your Model
Ones we are happy with our model its time to run a test. Go to Predict tab. Here you can upload an image of a plant to see how it performs. 

You can use [this](https://drive.google.com/open?id=1Jsyxivte28cT4LhifzlX_cFn4Ffz6KI_) image of a lotus and upload it in the UI to see how your model performance. 

### Advanced Model
Sometimes it happens that you are not happy with the performance of your model. We offer the option to train a more high quality model. This model takes longer to train. Go to the training tab and select 'train new model'. Go to training budget and select the 'high quality' model. Be aware that there is a cost associated with training the model. After training you can compare your two models like shown below:

![Compare models](https://github.com/Huize501/Images/blob/master/Screen%20Shot%202019-04-01%20at%203.28.16%20PM.png)

You can go to the AutoML Vision [documentation](https://cloud.google.com/automl/docs/) if you get stuck during the tutorial. First give the dataset a name (any name). Then select Upload images from your computer 'select files' and navigate on the flower.zip file that you downloaded to your local device. 

Disclaimer: there is a cost associated with using the Google Cloud Services. Please have a look at the pricing per product.