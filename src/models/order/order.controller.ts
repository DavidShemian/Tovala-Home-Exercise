import { JWTGuard } from '../../guards/jwt.guard';
import { BaseController } from '../../bases/controller.base';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ISuccessfulResponse } from '../../interfaces/successful-response.interface';
import { IRequestWithOptionalUser } from '../../interfaces/request-with-user.interface';

@Controller('order')
export class OrderController extends BaseController {
    @Post()
    @UseGuards(JWTGuard)
    public async orderPizza(@Req() request: IRequestWithOptionalUser): Promise<ISuccessfulResponse<void>> {
        return this.responseSuccess('Successfully login user');
    }
}
