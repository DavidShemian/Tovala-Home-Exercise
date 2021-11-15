/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalServerErrorException } from '@nestjs/common';
import { InternalExceptionCodes } from './internal-exception-codes.enum';

export class CustomInternalServerErrorException extends InternalServerErrorException {
    constructor(internalCode: InternalExceptionCodes, objectOrError?: string | object | any, description?: string) {
        super({ ...objectOrError, internalCode }, description);
    }
}
