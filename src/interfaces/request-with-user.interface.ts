import { Request } from 'express';
import { ITokenPayload } from './token-payload.interface';

export interface IRequestWithUser extends Request {
    user: ITokenPayload;
}
