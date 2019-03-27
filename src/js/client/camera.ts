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

import {addClass} from './helpers';

const SELECTORS = {
  CAMERA_ELEMENT: '.camera__element--js',
  CAMERA_BUTTON: '.camera__record_button'
};

const CSS_CLASSES = {
  CAMERA_FRONT_FACING: 'camera-front-facing'
};

export const VIDEO_PIXELS = 224;

/** Initializes and manages interaction with the camera */
export class Camera {
  /** The HTMLVideoElement used to show content from the camera */
  videoElement: HTMLVideoElement;
  /** A canvas element to save snapshots to */
  snapShotCanvas: HTMLCanvasElement;
  /** The native aspect ratio of the video element once initialized */
  aspectRatio: number;
  cameraButton: HTMLElement;

  constructor() {
    this.videoElement =
      <HTMLVideoElement>document.querySelector(SELECTORS.CAMERA_ELEMENT);
    this.cameraButton =
      <HTMLElement>document.querySelector(SELECTORS.CAMERA_BUTTON);
    this.snapShotCanvas = document.createElement('canvas');
  }

  /**
   * Requests access to the camera and return a Promise with the native width
   * and height of the video element when resolved.
   *
   * @async
   * @returns {Promise<CameraDimentions>} A promise with the width and height
   * of the video element used as the camera.
   */
  async setupCamera() {
      const me = this;
      const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {deviceId: 'cam', facingMode: 'environment'}
      });
      (<any>window).stream = stream;
      this.videoElement.srcObject = stream;
      return new Promise((resolve, reject) => {

        me.cameraButton.addEventListener('click', function(e: any){
          me.cameraButton.className = 'hidden';
          let img = me.snapshot();
          // fire event from window
          let event = new CustomEvent('cameraPhoto', {
            detail: img
          });
          window.dispatchEvent(event);
        });

        me.videoElement.onloadedmetadata = () => {
          resolve([me.videoElement.videoWidth,
              me.videoElement.videoHeight]);
        };
      });
  }

  /**
   * Adjusts the video element width and height to align with the native
   * screen aspect ratio while also constraining it to the amount of pixel
   * we use for our training data.
   *
   * @param width The video element native width.
   * @param height The video element native height.
   */
  setupVideoDimensions(width: number, height: number) {
    this.aspectRatio = width / height;

    if (width >= height) {
      this.videoElement.height = VIDEO_PIXELS;
      this.videoElement.width = this.aspectRatio * VIDEO_PIXELS;
    } else {
      this.videoElement.width = VIDEO_PIXELS;
      this.videoElement.height = VIDEO_PIXELS / this.aspectRatio;
    }
  }

  pauseCamera() {
      this.videoElement.pause();
  }

  unPauseCamera() {
      this.videoElement.play();
  }

  /**
   * Adjusts the camera CSS to flip the display since we are viewing the
   * camera on a desktop where we want the camera to be mirrored.
   */
  setFrontFacingCamera() {
    addClass(this.videoElement, CSS_CLASSES.CAMERA_FRONT_FACING);
  }

  /**
   * Takes a snapshot of the camera feed and converts it
   * to an image via a canvas element.
   * @returns <HTMLImageElement> The snapshot as an image node.
   */
  snapshot() {
    this.snapShotCanvas.height = this.videoElement.height;
    this.snapShotCanvas.width = this.videoElement.width;
    let ctx = this.snapShotCanvas.getContext('2d');
    ctx.drawImage(this.videoElement, 0, 0, this.snapShotCanvas.width,
        this.snapShotCanvas.height);
    let img = new Image();
    img.src = this.snapShotCanvas.toDataURL('image/png');
    this.pauseCamera();
    return img.src;
  }
}

export let camera = new Camera();
