import { CustomBadRequestException } from '../../exceptions/bad-request.exception';
import { BcryptService } from '../../auth/bcrypt/bcrypt.service';
import { UserDAL } from './user.dal';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../bases/service.base';
import { UserEntity } from './user.entity';
import { InternalExceptionCodes } from '../../exceptions/internal-exception-codes.enum';
import { UserRules } from './user-rules.enum';

@Injectable()
export class UserService extends BaseService {
    constructor(private readonly userDAL: UserDAL, private readonly bcryptService: BcryptService) {
        super();
    }

    public async createUser(address: string, email: string, password: string, rule: UserRules): Promise<UserEntity> {
        if (!this.validateEmail(email)) {
            throw new CustomBadRequestException(InternalExceptionCodes.BAD_PARAMS, { message: 'Invalid email address provided', email });
        }

        const hashedPassword = await this.bcryptService.getHash(password);

        return this.userDAL.saveUser(new UserEntity(address, email.toLowerCase(), hashedPassword, rule));
    }

    public async getUserByEmail(email: string): Promise<UserEntity | undefined> {
        return this.userDAL.getUserByEmail(email);
    }

    private validateEmail(email: string): boolean {
        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return emailRegex.test(email.toLowerCase());
    }
}
