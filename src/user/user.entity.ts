import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseEntity } from '../bases/entity.base';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ type: 'varchar', unique: true, nullable: true })
    @ApiProperty()
    public email!: string;

    @ApiProperty()
    @IsNumber()
    @Column({ type: 'varchar', unique: false, nullable: false })
    public password!: string;

    constructor(email: string, password: string) {
        super();

        this.email = email;
        this.password = password;
    }
}
