import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { DBService } from './db.service';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [DBModule],
            useFactory: (dBService: DBService) => dBService.getDBConfig(),
            inject: [DBService],
        }),
    ],
    providers: [DBService],
    exports: [DBService],
})
export class DBModule {}
