import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '../order-status.enum';

export class UpdateOrderStatusDTO {
    @ApiProperty()
    @IsString()
    public id!: string;

    @ApiProperty()
    @IsEnum(OrderStatus)
    public status!: OrderStatus;
}
