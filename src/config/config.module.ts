import { Module } from '@nestjs/common';
import { Config } from './config';

@Module({
    imports: [],
    providers: [Config],
    exports: [Config],
})
export class ConfigModule {}
