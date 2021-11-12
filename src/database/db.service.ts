import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FoodItemEntity } from '../models/food-items/entities/food-item.entity';
import { Config } from '../config/config';
import { UserEntity } from '../models/user/user.entity';
import { FoodItemTypeEntity } from '../models/food-items/entities/food-item-type.entity';

@Injectable()
export class DBService {
    constructor(private readonly config: Config) {}

    public getDBConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',

            host: this.config.POSTGRES_HOST,
            port: this.config.POSTGRES_PORT,
            username: this.config.POSTGRES_USER,
            password: this.config.POSTGRES_PASSWORD,
            database: this.config.POSTGRES_DB_NAME,

            entities: [UserEntity, FoodItemEntity, FoodItemTypeEntity],
            retryAttempts: 0,
            synchronize: true, // In a real production project should use migrations
        };
    }
}
