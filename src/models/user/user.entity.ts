import { OrderEntity } from './../order/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserRules } from './user-rules.enum';
import { BaseEntity } from '../../bases/entity.base';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar', unique: false, nullable: false })
    public address!: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    public email!: string;

    @OneToMany(() => OrderEntity, (order) => order.user)
    public order!: OrderEntity;

    @Column({ type: 'varchar', unique: false, nullable: false })
    public password!: string;

    @Column({ type: 'enum', enum: UserRules, unique: false, nullable: false, default: UserRules.CUSTOMER })
    public rule!: UserRules;

    constructor(address: string, email: string, password: string, rule: UserRules) {
        super();

        this.address = address;
        this.email = email;
        this.password = password;
        this.rule = rule;
    }
}
