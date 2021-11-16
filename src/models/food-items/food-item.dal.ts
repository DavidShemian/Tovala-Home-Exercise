import { INativeDBException } from './../../database/db.exception';
import { FoodItemTypeEntity } from './entities/food-item-type.entity';
import { Injectable } from '@nestjs/common';
import { FoodItemEntity } from './entities/food-item.entity';
import { BaseDAL } from '../../bases/dal.base';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { throwInternalDBException } from '../../database/db.exception';

@Injectable()
export class FoodItemDAL extends BaseDAL {
    constructor(
        @InjectRepository(FoodItemEntity) private readonly foodItemRepository: Repository<FoodItemEntity>,
        @InjectRepository(FoodItemTypeEntity) private readonly foodItemTypeRepository: Repository<FoodItemTypeEntity>
    ) {
        super();
    }

    public async createFoodItems(foodItems: FoodItemEntity[]): Promise<FoodItemEntity[]> {
        try {
            // await only for try and catch
            return await this.foodItemRepository.save(foodItems);
        } catch (e) {
            throw throwInternalDBException(e as INativeDBException);
        }
    }

    public async createFoodItemsTypes(foodItemsTypes: FoodItemTypeEntity[]): Promise<FoodItemTypeEntity[]> {
        try {
            return await this.foodItemTypeRepository.save(foodItemsTypes);
        } catch (e) {
            throw throwInternalDBException(e as INativeDBException);
        }
    }

    public async getAllFodItemTypes(): Promise<FoodItemTypeEntity[]> {
        try {
            return await this.foodItemTypeRepository.find();
        } catch (e) {
            throw throwInternalDBException(e as INativeDBException);
        }
    }

    public async getAllFodItems(): Promise<FoodItemEntity[]> {
        try {
            return await this.foodItemRepository.find({ where: { inStock: true }, relations: ['foodItemTypeEntity'] });
        } catch (e) {
            throw throwInternalDBException(e as INativeDBException);
        }
    }

    public async getFoodItemsByIds(ids: string[]): Promise<FoodItemEntity[]> {
        try {
            return await this.foodItemRepository.find({
                where: { id: In(ids), inStock: true },
            });
        } catch (e) {
            throw throwInternalDBException(e as INativeDBException);
        }
    }
}
