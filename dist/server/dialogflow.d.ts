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
    private detectStreamCall;
    constructor();
    setupDialogflow(meta: any): void;
    detectStream(audio: any, cb: Function): void;
    stopStream(): void;
}
export declare let dialogflow: Dialogflow;
