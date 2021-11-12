import { UserDAL } from './user.dal';
import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { BcryptModule } from '../../auth/bcrypt/bcrypt.module';

@Module({
    imports: [BcryptModule, TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, UserDAL],
    exports: [UserService],
})
export class UserModule {}
