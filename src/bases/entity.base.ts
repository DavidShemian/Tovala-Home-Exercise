import { IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @CreateDateColumn({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
    public createDateTime!: Date;

    @PrimaryGeneratedColumn('uuid')
    @IsOptional()
    public id!: string;

    @Column({ type: 'boolean', default: true })
    @IsOptional()
    public isActive!: boolean;

    @Column({ type: 'boolean', default: false })
    @IsOptional()
    public isArchived!: boolean;

    @UpdateDateColumn({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
    public lastChangedDateTime!: Date;
}
