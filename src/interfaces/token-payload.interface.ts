import { UserRules } from './../models/user/user-rules.enum';

export interface ITokenPayload {
    id: string;
    rule: UserRules;
}
