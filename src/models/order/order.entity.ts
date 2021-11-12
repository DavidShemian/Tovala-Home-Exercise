import { OrderStatus } from './order-status.enum';
import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseEntity } from '../../bases/entity.base';

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @Column({ type: 'varchar', unique: true, nullable: false })
    @ApiProperty()
    public email!: string;

    @ApiProperty()
    @IsNumber()
    @Column({ type: 'varchar', unique: false, nullable: false })
    public password!: string;

    @Column({ type: 'enum', enum: OrderStatus, unique: false, nullable: false, default: OrderStatus.PREPARING })
    public status!: OrderStatus;

    constructor(email: string, password: string) {
        super();

        this.email = email;
        this.password = password;
    }
}
