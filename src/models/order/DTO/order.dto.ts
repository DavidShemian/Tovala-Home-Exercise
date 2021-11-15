import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderDTO {
    @ApiProperty()
    @IsString({ each: true })
    public foodItemsIds!: string[];
}
