import { ConfigModule } from '../../config/config.module';
import { TokenService } from './token.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [ConfigModule],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
