/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from '@nestjs/common';
import { InternalExceptionCodes } from './internal-exception-codes.enum';

export class CustomBadRequestException extends BadRequestException {
    constructor(internalCode: InternalExceptionCodes, objectOrError?: string | object | any, description?: string) {
        super({ ...objectOrError, internalCode }, description);
    }
}
