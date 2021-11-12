import { ConfigModule } from '../../config/config.module';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
    imports: [ConfigModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
