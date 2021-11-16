import { FoodItemEntity } from './entities/food-item.entity';
import { FoodItemService } from './food-item.service';
import { AdminGuard } from '../../guards/admin.guard';
import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { BaseController } from '../../bases/controller.base';
import { FoodItemTypeEntity } from '../../models/food-items/entities/food-item-type.entity';
import { JWTGuard } from '../../guards/jwt.guard';
import { ISuccessfulResponse } from '../../interfaces/successful-response.interface';
import { FoodItemsDTO } from './DTO/food-item.dto';
import { FoodItemsTypesDTO } from './DTO/food-item-types.dto';

@Controller('food-item')
@UseGuards(JWTGuard)
export class FoodItemController extends BaseController {
    constructor(private readonly foodItemService: FoodItemService) {
        super();
    }

    @Post()
    @UseGuards(AdminGuard)
    public async addFoodItems(@Body() foodItemsDTO: FoodItemsDTO): Promise<ISuccessfulResponse<void>> {
        await this.foodItemService.addFoodItems(foodItemsDTO);

        return this.responseSuccess('Successfully added foodItems to db');
    }

    @Post('/type')
    @UseGuards(AdminGuard)
    public async addFoodItemsTypes(@Body() foodItemsTypesDTO: FoodItemsTypesDTO): Promise<ISuccessfulResponse<void>> {
        await this.foodItemService.addFoodItemsTypes(foodItemsTypesDTO);

        return this.responseSuccess('Successfully added foodItemsTypes to db');
    }

    @Get('/type')
    @UseGuards(AdminGuard)
    public async getAllFoodItemTypes(): Promise<ISuccessfulResponse<FoodItemTypeEntity[]>> {
        const result = await this.foodItemService.getAllFoodItemTypes();

        return this.responseSuccess('Successfully got all food item types', result);
    }

    /**
     * Can be used to display options in the front end app
     * @param foodItemsTypesDTO
     * @returns all available
     */
    @Get()
    public async getAllFoodItems(): Promise<ISuccessfulResponse<FoodItemEntity[]>> {
        const result = await this.foodItemService.getAllFoodItems();

        return this.responseSuccess('Successfully got all food items', result);
    }
}
