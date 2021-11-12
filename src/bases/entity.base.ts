import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    public createDateTime?: Date;

    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'boolean', default: true })
    public isActive?: boolean;

    @Column({ type: 'boolean', default: false })
    public isArchived?: boolean;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    public lastChangedDateTime?: Date;
}
