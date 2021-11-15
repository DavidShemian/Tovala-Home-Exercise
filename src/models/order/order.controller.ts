import { UpdateOrderStatusDTO } from './DTO/update-order-status.dto';
import { OrderService } from './order.service';
import { JWTGuard } from '../../guards/jwt.guard';
import { BaseController } from '../../bases/controller.base';
import { Controller, Post, Req, UseGuards, Body, Put, Get, Param } from '@nestjs/common';
import { ISuccessfulResponse } from '../../interfaces/successful-response.interface';
import { IRequestWithUser } from '../../interfaces/request-with-user.interface';
import { OrderDTO } from './DTO/order.dto';
import { OrderEntity } from './order.entity';
import { AdminGuard } from '../../guards/admin.guard';

@Controller('order')
@UseGuards(JWTGuard)
export class OrderController extends BaseController {
    constructor(private readonly orderService: OrderService) {
        super();
    }

    @Post()
    public async createOrder(@Req() request: IRequestWithUser, @Body() orderDTO: OrderDTO): Promise<ISuccessfulResponse<OrderEntity>> {
        const orderSummary = await this.orderService.createOrder(request.user.id, orderDTO);

        return this.responseSuccess('Successfully submitted new order', orderSummary);
    }

    @Get('status/:id')
    public async getOrderStatus(@Param() { id }: { id: string }): Promise<ISuccessfulResponse<{ status: string }>> {
        const orderStatus = await this.orderService.getOrderById(id);

        return this.responseSuccess('Successfully got order status', { status: orderStatus.status });
    }

    @Put('status')
    @UseGuards(AdminGuard)
    public async updateOrderStatus(@Body() updateOrderStatusDTO: UpdateOrderStatusDTO): Promise<ISuccessfulResponse<UpdateOrderStatusDTO>> {
        const updatedOrder = await this.orderService.updateOrder(updateOrderStatusDTO);

        return this.responseSuccess('Successfully update order status', updatedOrder);
    }
}
