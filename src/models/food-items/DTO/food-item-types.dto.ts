import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FoodItemTypeEntity } from '../entities/food-item-type.entity';

export class FoodItemsTypesDTO {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FoodItemTypeEntity)
    public foodItemsTypes!: FoodItemTypeEntity[];
}
