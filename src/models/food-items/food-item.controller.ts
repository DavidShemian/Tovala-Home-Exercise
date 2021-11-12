import { FoodItemService } from './food-item.service';
import { AdminGuard } from '../../guards/admin.guard';
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { BaseController } from '../../bases/controller.base';
import { JWTGuard } from '../../guards/jwt.guard';
import { ISuccessfulResponse } from '../../interfaces/successful-response.interface';
import { FoodItemsDTO } from './DTO/food-item.dto';
import { FoodItemsTypesDTO } from './DTO/food-item-types.dto';

@Controller('food-item')
@UseGuards(AdminGuard)
@UseGuards(JWTGuard)
export class FoodItemController extends BaseController {
    constructor(private readonly foodItemService: FoodItemService) {
        super();
    }

    @Post()
    public async addFoodItems(@Body() foodItemsDTO: FoodItemsDTO): Promise<ISuccessfulResponse<void>> {
        await this.foodItemService.addFoodItems(foodItemsDTO);

        return this.responseSuccess('Successfully added foodItems to db');
    }

    @Post('/type')
    public async addFoodItemsTypes(@Body() foodItemsTypesDTO: FoodItemsTypesDTO): Promise<ISuccessfulResponse<void>> {
        await this.foodItemService.addFoodItemsTypes(foodItemsTypesDTO);

        return this.responseSuccess('Successfully added foodItemsTypes to db');
    }
}
