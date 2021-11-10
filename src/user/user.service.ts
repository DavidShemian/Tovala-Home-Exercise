import { BcryptService } from '../bcrypt/bcrypt.service';
import { UserDAL } from './user.dal';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../bases/service.base';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends BaseService {
    constructor(private readonly userDAL: UserDAL, private readonly bcryptService: BcryptService) {
        super();
    }

    public async createUser(email: string, password: string): Promise<UserEntity> {
        if (!this.validateEmail(email)) {
            throw new BadRequestException({ message: 'Invalid email address provided', email });
        }

        const hashedPassword = await this.bcryptService.getHash(password);

        return this.userDAL.saveUser(new UserEntity(email.toLowerCase(), hashedPassword));
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
