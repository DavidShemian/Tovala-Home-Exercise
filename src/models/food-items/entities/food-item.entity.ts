import { Type } from 'class-transformer';
import { FoodItemTypeEntity } from './food-item-type.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../bases/entity.base';

class FoodItemTypeId {
    @IsString()
    public id!: string;
}

@Entity('foodItems')
export class FoodItemEntity extends BaseEntity {
    @Type(() => FoodItemTypeId)
    @OneToOne(() => FoodItemTypeEntity, { nullable: false })
    @JoinColumn()
    public foodItemTypeEntity!: FoodItemTypeEntity;

    @ApiProperty()
    public foodItemTypeEntityId?: string;

    @ApiProperty()
    @IsOptional()
    @Column({ type: 'boolean', unique: false, nullable: false, default: true })
    public inStock?: boolean;

    @Column({ type: 'varchar', unique: true, nullable: false })
    @IsString()
    @ApiProperty()
    public name!: string;

    @ApiProperty()
    @IsNumber()
    @Column({ type: 'float', unique: false, nullable: false })
    public price!: number;
}
