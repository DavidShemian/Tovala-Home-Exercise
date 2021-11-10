import { UserModule } from '../user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../config/config';
import { ConfigModule } from '../config/config.module';
import { AuthService } from './auth.service';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        BcryptModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: Config) => ({
                secret: config.JWT_SECRET,
            }),
            inject: [Config],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
