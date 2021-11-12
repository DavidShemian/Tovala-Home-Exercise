import { Request } from 'express';
import { ITokenPayload } from './token-payload.interface';

export interface IRequestWithOptionalUser extends Request {
    user?: ITokenPayload;
}
