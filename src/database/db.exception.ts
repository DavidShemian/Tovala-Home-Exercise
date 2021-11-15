import { CustomInternalServerErrorException } from './../exceptions/internal-server.exception';
import { Logger } from '@nestjs/common';
import { CustomBadRequestException } from '../exceptions/bad-request.exception';
import { InternalExceptionCodes } from '../exceptions/internal-exception-codes.enum';

// Postgres native exception interface
export interface INativeDBException {
    code: string;
    detail: string;
    message: string;
    query: string;
    parameters: unknown[];
}

export enum DBExceptionCodes {
    FOREIGN_KEY_VIOLATION = '23503',
    UNIQUE_VIOLATION = '23505',
    NOT_NULL_VIOLATION = '23502',
    INVALID_INPUT = '22P02',
}

/**
 * Converts native db error to internal error
 * The goal is to use our internal exceptions instead of the DB native ones, so we can keep a single exception format.
 * If in the future we want to change DB, simply change the interface and enums.
 * @param nativeError the native error from db
 */
export const throwInternalDBException = (nativeError: INativeDBException): void => {
    const logger = new Logger(throwInternalDBException.name);

    const code = nativeError.code as DBExceptionCodes;
    const { detail } = nativeError;

    if (code === DBExceptionCodes.UNIQUE_VIOLATION) {
        const message = 'Unique violation';
        logger.error(message, nativeError);

        throw new CustomBadRequestException(InternalExceptionCodes.UNIQUE_VIOLATION, { message, detail });
    }

    if (code === DBExceptionCodes.FOREIGN_KEY_VIOLATION) {
        const message = 'Foreign key violation';
        logger.error(message, nativeError);

        throw new CustomBadRequestException(InternalExceptionCodes.FOREIGN_KEY_VIOLATION, { message, detail });
    }

    if (code === DBExceptionCodes.NOT_NULL_VIOLATION) {
        const message = 'Not null violation';
        logger.error(message, nativeError);

        throw new CustomBadRequestException(InternalExceptionCodes.NOT_NULL_VIOLATION, { message, detail });
    }

    if (code === DBExceptionCodes.INVALID_INPUT) {
        const errorMessage = 'Invalid input';
        logger.error(errorMessage, nativeError);

        // Postgres error object includes message and not detail for this king of error
        throw new CustomBadRequestException(InternalExceptionCodes.INVALID_INPUT, { errorMessage, detail: nativeError.message });
    }

    const message = 'Unexpected DB Error';
    logger.error(message, nativeError);

    throw new CustomInternalServerErrorException(InternalExceptionCodes.UNEXPECTED_DB_ERROR, { message });
};
