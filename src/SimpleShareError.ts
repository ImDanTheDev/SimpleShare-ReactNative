export default class SimpleShareError extends Error {
    readonly code: ErrorCode;

    constructor(code: ErrorCode) {
        super(code);
        this.name = 'SimpleShareError';
        this.code = code;
    }
}

export enum ErrorCode {
    // Auth Errors
    SIGN_IN_CANCELLED = 'The user cancelled the sign in operation.',
    SIGN_IN_INVALID_CREDENTIALS = 'The credentials are invalid',
    ACCOUNT_DISABLED = "The user's account is disabled.",
    UNEXPECTED_SIGN_IN_ERROR = 'An unexpected error occurred during the sign in.',
    // Database Errors
    UNEXPECTED_DATABASE_ERROR = 'An unexpected error occurred with the database',
}
