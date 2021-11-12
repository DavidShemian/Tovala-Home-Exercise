import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Config } from '../../config/config';
import { BaseService } from '../../bases/service.base';

@Injectable()
export class TokenService extends BaseService {
    constructor(private readonly config: Config) {
        super();
    }

    public sign(payload: object): string {
        return sign(payload, this.config.JWT_SECRET, { expiresIn: '1h' });
    }

    public verify(token: string): string | JwtPayload {
        return verify(token, this.config.JWT_SECRET);
    }
}
