export declare class Dialogflow {
    private sessionClient;
    private sessionPath;
    private projectId;
    private sessionId;
    private languageCode;
    private encoding;
    private sampleRateHertz;
    private singleUtterance;
    private isInitialRequest;
    constructor();
    setupDialogflow(): void;
    convertDataURIToBinary(dataURI: any): Buffer;
    detectStream(audio: any): void;
    stopStream(): void;
    detectIntent(audio: any): void;
}
export declare let dialogflow: Dialogflow;
