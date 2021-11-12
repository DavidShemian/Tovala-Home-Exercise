import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FoodItemEntity } from '../entities/food-item.entity';

export class FoodItemsDTO {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FoodItemEntity)
    public foodItems!: FoodItemEntity[];
}
