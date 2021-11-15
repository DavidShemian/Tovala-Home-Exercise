import { FoodItemTypeEntity } from './entities/food-item-type.entity';
import { FoodItemEntity } from './entities/food-item.entity';
import { FoodItemDAL } from './food-item.dal';
import { FoodItemService } from './food-item.service';
import { ConfigModule } from '../../config/config.module';
import { Module } from '@nestjs/common';
import { FoodItemController } from './food-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([FoodItemEntity, FoodItemTypeEntity])],
    controllers: [FoodItemController],
    providers: [FoodItemService, FoodItemDAL],
    exports: [FoodItemService],
})
export class FoodItemModule {}
