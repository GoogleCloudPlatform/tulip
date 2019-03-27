export declare class AutoMl {
    private sessionClient;
    private projectId;
    private location;
    private model;
    constructor();
    detect(base64Img: string, callback: Function): void;
}
export declare let automl: AutoMl;
