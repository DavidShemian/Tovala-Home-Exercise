import { FoodItemsTypesDTO } from './DTO/food-item-types.dto';
import { FoodItemEntity } from './entities/food-item.entity';
import { FoodItemDAL } from './food-item.dal';
import { FoodItemsDTO } from './DTO/food-item.dto';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../bases/service.base';
import { FoodItemTypeEntity } from './entities/food-item-type.entity';

@Injectable()
export class FoodItemService extends BaseService {
    constructor(private readonly foodItemDAL: FoodItemDAL) {
        super();
    }

    public async addFoodItems({ foodItems }: FoodItemsDTO): Promise<FoodItemEntity[]> {
        return this.foodItemDAL.createFoodItems(foodItems);
    }

    public async addFoodItemsTypes({ foodItemsTypes }: FoodItemsTypesDTO): Promise<FoodItemTypeEntity[]> {
        return this.foodItemDAL.createFoodItemsTypes(foodItemsTypes);
    }

    public async getAllFoodItemTypes(): Promise<FoodItemTypeEntity[]> {
        return this.foodItemDAL.getAllFodItemTypes();
    }

    public async getAllFoodItems(): Promise<FoodItemEntity[]> {
        return this.foodItemDAL.getAllFodItems();
    }

    public async getFoodItemsByIds(foodItemsIds: string[]): Promise<FoodItemEntity[]> {
        return this.foodItemDAL.getFoodItemsByIds(foodItemsIds);
    }
}
