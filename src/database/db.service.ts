import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Config } from '../config/config';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class DBService {
    constructor(private readonly config: Config) {}

    public getDBConfig(): TypeOrmModuleOptions {
        return {
            type: 'sqlite',
            database: this.config.DB_LOCATION,
            entities: [UserEntity],
            retryAttempts: 0,
            synchronize: true, // In a real production project should use migrations
        };
    }
}
