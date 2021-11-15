import { OrderEntity } from './order.entity';
import { OrderDAL } from './order.dal';
import { FoodItemModule } from './../food-items/food-item.module';
import { ConfigModule } from '../../config/config.module';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [ConfigModule, FoodItemModule, TypeOrmModule.forFeature([OrderEntity])],
    controllers: [OrderController],
    providers: [OrderService, OrderDAL],
})
export class OrderModule {}
