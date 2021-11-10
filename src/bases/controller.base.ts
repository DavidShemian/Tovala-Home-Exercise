import { ISuccessfulResponse } from '../interfaces/successful-response.interface';

export abstract class BaseController {
    protected responseSuccess<T>(message: string, data?: T): ISuccessfulResponse<T> {
        return { message, data };
    }
}
