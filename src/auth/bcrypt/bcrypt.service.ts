import { Injectable } from '@nestjs/common';
import { BaseService } from '../../bases/service.base';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class BcryptService extends BaseService {
    public async compare(s: string, hash: string): Promise<boolean> {
        return compareSync(s, hash);
    }

    public async getHash(toHash: string): Promise<string> {
        return hashSync(toHash, 10);
    }
}
