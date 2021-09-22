export class RNSimpleShareError extends Error {
    readonly code: RNErrorCode;
    readonly additionalInfo: string | undefined;

    constructor(code: RNErrorCode, additionalInfo?: string) {
        super(code);
        this.name = 'RNSimpleShareError';
        this.code = code;
        this.additionalInfo = additionalInfo;
    }
}

export enum RNErrorCode {
    PERMISSION_DENIED = 'The user denied permission to Simple Share',
}
