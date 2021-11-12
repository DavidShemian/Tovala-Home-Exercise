import { UserModule } from '../models/user/user.module';
import { TokenModule } from './token/token.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { AuthService } from './auth.service';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [ConfigModule, UserModule, BcryptModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
