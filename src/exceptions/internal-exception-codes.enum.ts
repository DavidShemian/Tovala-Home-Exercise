/**
 * The goal of this object is to define internal exception code to be used both by front end and back end.
 * Easier than using the text that inside the exception.
 * In a real production full stack app, this should be inside an independent package from front end and back end.
 */

export enum InternalExceptionCodes {
    UNIQUE_VIOLATION = 1234,
    FOREIGN_KEY_VIOLATION = 4231,
    NOT_NULL_VIOLATION = 1111,
    UNEXPECTED_DB_ERROR = 9999,
    INVALID_INPUT = 9999,
    BAD_PARAMS = 5544,
}
