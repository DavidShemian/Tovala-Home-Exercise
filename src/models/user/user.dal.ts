import { INativeDBException } from './../../database/db.exception';
import { throwInternalDBException } from '../../database/db.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAL } from '../../bases/dal.base';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserDAL extends BaseDAL {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
        super();
    }

    public async getUserByEmail(email: string): Promise<UserEntity | undefined> {
        try {
            return await this.userRepository.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw throwInternalDBException(error as INativeDBException);
        }
    }

    public async saveUser(user: UserEntity): Promise<UserEntity> {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw throwInternalDBException(error as INativeDBException);
        }
    }
}
