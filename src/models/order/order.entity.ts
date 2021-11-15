import { FoodItemEntity } from './../food-items/entities/food-item.entity';

import { UserEntity } from '../user/user.entity';
import { OrderStatus } from './order-status.enum';
import { Column, Entity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../bases/entity.base';

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @ManyToMany(() => FoodItemEntity)
    @JoinTable()
    public foodItems!: FoodItemEntity[];

    @Column({ type: 'float', unique: false, nullable: false })
    public price!: number;

    @Column({ type: 'enum', enum: OrderStatus, unique: false, nullable: false, default: OrderStatus.PREPARING })
    public status!: OrderStatus;

    @ManyToOne(() => UserEntity, (user) => user.order, { nullable: false })
    public user!: UserEntity;

    public userId!: string;

    constructor(foodItems: FoodItemEntity[], price: number, user: UserEntity, status = OrderStatus.PREPARING) {
        super();

        this.foodItems = foodItems;
        this.price = price;
        this.status = status;
        this.user = user;
    }
}
