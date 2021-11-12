import { FoodItemModule } from './models/food-items/food-item.module';
import { Module } from '@nestjs/common';
import { DBModule } from './database/db.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './models/order/order.module';

@Module({
    imports: [DBModule, AuthModule, OrderModule, FoodItemModule],
})
export class AppModule {}
