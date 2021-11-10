import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAL } from '../bases/dal.base';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserDAL extends BaseDAL {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
        super();
    }

    public async getUserByEmail(email: string): Promise<UserEntity | undefined> {
        return this.userRepository.findOne({ email: email.toLowerCase() });
    }

    // TODO: duplicate email error
    public async saveUser(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
    }
}
