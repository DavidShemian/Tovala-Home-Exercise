import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order-status.enum';

export class UpdateOrderStatusDTO {
    @ApiProperty()
    @IsEnum(OrderStatus)
    public status!: OrderStatus;
}
