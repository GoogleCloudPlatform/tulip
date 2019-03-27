export declare class Dialogflow {
    private sessionClient;
    private sessionPath;
    private fileWriter;
    private projectId;
    private sessionId;
    private languageCode;
    private encoding;
    private sampleRateHertz;
    private singleUtterance;
    private isInitialRequest;
    detectStreamCall: any;
    constructor();
    setupDialogflow(meta: any): void;
    prepareStream(audio: any, cb: Function): void;
    finalizeStream(): void;
}
export declare let dialogflow: Dialogflow;
