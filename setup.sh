# 
# @license
# Copyright 2018 Google LLC
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     https://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# =============================================================================
# 

source ./.env

SERVICE_ACCOUNT_NAME="shunkaen-app-$(date +"%s")"
BUCKET="project-shunkaen-vcm"

mkdir temp/

SA_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:$SERVICE_ACCOUNT_NAME" \
  --format='value(email)')

gcloud services enable dialogflow.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable automl.googleapis.com
gcloud services enable storage-api.googleapis.com&

gcloud iam service-accounts create \
  $SERVICE_ACCOUNT_NAME \
  --display-name $SERVICE_ACCOUNT_NAME

SA_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:$SERVICE_ACCOUNT_NAME" \
  --format='value(email)')

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_EMAIL \
  --role roles/dialogflow.admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_EMAIL \
  --role roles/dialogflow.reader
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_EMAIL \
  --role roles/clouddebugger.agent
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_EMAIL \
  --role roles/errorreporting.admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member serviceAccount:$SA_EMAIL \
  --role roles/logging.logWriter
gcloud projects add-iam-policy-binding $PROJECT_ID \
   --member serviceAccount:$SA_EMAIL \
   --role roles/automl.admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
   --member serviceAccount:$SA_EMAIL \
   --role roles/automl.editor

cloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:custom-vision@appspot.gserviceaccount.com" \
  --role="roles/ml.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:custom-vision@appspot.gserviceaccount.com" \
  --role="roles/storage.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:custom-vision@appspot.gserviceaccount.com" \
  --role="roles/serviceusage.serviceUsageAdmin"

gsutil mb -p $PROJECT_ID -c regional -l us-central1 gs://${BUCKET}/

gsutil -m cp -R gs://cloud-ml-data/img/flower_photos/ gs://${BUCKET}/img/
gsutil cat gs://${BUCKET}/img/flower_photos/all_data.csv | sed "s:cloud-ml-data:${BUCKET}:" > all_data.csv
gsutil cp all_data.csv gs://${BUCKET}/csv/