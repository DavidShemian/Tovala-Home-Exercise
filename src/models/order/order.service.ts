import { Injectable, Logger } from '@nestjs/common';
import { CustomBadRequestException } from '../../exceptions/bad-request.exception';
import { OrderDAL } from './order.dal';
import { OrderEntity } from './order.entity';
import { FoodItemService } from './../food-items/food-item.service';
import { BaseService } from '../../bases/service.base';
import { OrderDTO } from './DTO/order.dto';
import { UserEntity } from '../user/user.entity';
import { FoodItemEntity } from '../food-items/entities/food-item.entity';
import { UpdateOrderStatusDTO } from './DTO/update-order-status.dto';
import { InternalExceptionCodes } from '../../exceptions/internal-exception-codes.enum';

@Injectable()
export class OrderService extends BaseService {
    private readonly logger = new Logger(OrderService.name);

    constructor(private readonly foodItemService: FoodItemService, private readonly orderDAL: OrderDAL) {
        super();
    }

    public async createOrder(userId: string, { foodItemsIds }: OrderDTO): Promise<OrderEntity> {
        const foodItemsFromDb = await this.getOrderFoodItems(foodItemsIds);
        const order = new OrderEntity(foodItemsFromDb, this.getOrderPrice(foodItemsFromDb), { id: userId } as UserEntity);

        this.logger.log('Submitting new order', order);

        const newOrder = await this.orderDAL.createOrder(order);

        return this.getOrderResponse(newOrder);
    }

    public async getOrderById(orderId: string): Promise<OrderEntity> {
        const order = await this.orderDAL.getOrderById(orderId);

        if (!order) {
            throw new CustomBadRequestException(InternalExceptionCodes.BAD_PARAMS, { message: 'Unable to find order', orderId });
        }

        return order;
    }

    public async updateOrder(orderId: string, { status }: UpdateOrderStatusDTO): Promise<UpdateOrderStatusDTO> {
        return this.orderDAL.updateStatus(orderId, status);
    }

    private async getOrderFoodItems(foodItemsIds: string[]): Promise<FoodItemEntity[]> {
        const foodItemsFromDb = await this.foodItemService.getFoodItemsByIds(foodItemsIds);

        // Validate all food items present in our DBß
        if (foodItemsFromDb.length !== foodItemsIds.length) {
            throw new CustomBadRequestException(InternalExceptionCodes.BAD_PARAMS, { message: '1 or more food items are missing', foodItemsIds });
        }

        return foodItemsFromDb;
    }

    private getOrderPrice(foodItems: FoodItemEntity[]): number {
        return foodItems.reduce((summand, { price }) => (summand += price), 0);
    }

    private getOrderResponse(orderEntity: OrderEntity): OrderEntity {
        const foodItemsResponseFormat = orderEntity.foodItems.map(({ inStock, name, price }) => ({ inStock, name, price }));

        return { ...orderEntity, foodItems: foodItemsResponseFormat as FoodItemEntity[] };
    }
}
