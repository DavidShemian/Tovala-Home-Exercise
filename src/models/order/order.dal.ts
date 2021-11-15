import { OrderStatus } from './order-status.enum';
import { OrderEntity } from './order.entity';
import { INativeDBException } from './../../database/db.exception';
import { throwInternalDBException } from '../../database/db.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAL } from '../../bases/dal.base';
import { Repository } from 'typeorm';
import { UpdateOrderStatusDTO } from './DTO/update-order-status.dto';

@Injectable()
export class OrderDAL extends BaseDAL {
    constructor(@InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>) {
        super();
    }

    public async createOrder(order: OrderEntity): Promise<OrderEntity> {
        try {
            return await this.orderRepository.save(order);
        } catch (error) {
            throw throwInternalDBException(error as INativeDBException);
        }
    }

    public async getOrderById(id: string): Promise<OrderEntity | undefined> {
        try {
            return await this.orderRepository.findOne({ id });
        } catch (error) {
            throw throwInternalDBException(error as INativeDBException);
        }
    }

    public async updateStatus(id: string, status: OrderStatus): Promise<UpdateOrderStatusDTO> {
        try {
            return await this.orderRepository.save({ id, status });
        } catch (error) {
            throw throwInternalDBException(error as INativeDBException);
        }
    }
}
