import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseEntity } from '../../../bases/entity.base';

@Entity('foodItemsTypes')
export class FoodItemTypeEntity extends BaseEntity {
    @Column({ type: 'varchar', unique: true, nullable: false })
    @IsString()
    @ApiProperty()
    public type!: string;
}
