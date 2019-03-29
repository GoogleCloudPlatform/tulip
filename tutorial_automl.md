## How to train your own flower classification model using Google Cloud AutoML

It is our pleasure to announce Google Tulip, our machine learning technology to improve the profitability of Dutch agriculture and the well-being of Dutch cash crops. But we also wanted to provide people with the possibility to train their own model using Google Cloud AutoML Technology. 

This tutorial helps you to get started with training and deploying your own Flower Classifier using Google Cloud [AutoML](https://cloud.google.com/automl/). 

If you want to start with a more detailed tutorial, then its best to follow this more detailed [AutoML](https://cloud.google.com/vision/automl/docs/tutorial) tutorial on our website. 

### How to get started with training and deploying your own flower detector. 

To train our own AutoML model you first need to get the data. The data is stored in a bucket on [Google Cloud Storage](https://cloud.google.com/storage/). Download the zip file from the [url](https://storage.googleapis.com/flower-automl/flowers.zip). This wil download the flower.zip file to your local device. 

### Go to AutoML Vision 

Go to your Google cloud [console](https://console.cloud.google.com). Go to the navigation menu on the top left. This will show you all Google Cloud services that are available. Navigate to the Artificial Intelligence products and select vision. Then select AutoML Image Classification. You can also navigate to [AutoML Vision](http://console.cloud.google.com/vision/) directly (if you have a [Google Cloud Project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)). 

### Upload the data

You have made it to the AutoML Vision UI! You rock :) You will now see the dataset tab. Please select 'new dataset'. Then select 'create dataset'. AutoML Vision will now upload the data to your Google Cloud Project. Uploading can take a while. If you see a notification saying duplicate files detected you can select 'dismiss'. 

### Train your model
Now navigate to the train tab and select 'start training'. AutoML Vision will now start training the model! Of course this takes some time. So get yourself a coffee and make sure you plants get some water. 

### Test your Model
After training is done you can test your model. Now go to Predict tab. Here you can upload an image of a plant to see how it performs. 

You can go to the AutoML Vision [documentation](https://cloud.google.com/automl/docs/) if you get stuck during the tutorial. First give the dataset a name (any name). Then select Upload images from your computer 'select files' and navigate on the flower.zip file that you downloaded to your local device. 

Disclaimer: there is cost associated with using the Google Cloud Services. Please have a look at the pricing per product. 