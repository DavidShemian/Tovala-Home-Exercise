import { FoodItemEntity } from './../src/models/food-items/entities/food-item.entity';
import { FoodItemTypeEntity } from './../src/models/food-items/entities/food-item-type.entity';
import { connection, adminPostRequest } from './configs/setup-e2e';

describe('FoodItem (e2e)', () => {
    const TEST_ROUTE = '/food-item';

    it('Should create food items and types', async () => {
        // Add food item types
        const typeBody = {
            foodItemsTypes: [
                {
                    type: 'Appetizer',
                },
                {
                    type: 'Entree',
                },
                {
                    type: 'Pizza Topping',
                },
            ],
        };

        const response = await adminPostRequest(`${TEST_ROUTE}/type`, typeBody);

        expect(response.status).toBe(201);

        const foodItemTypesFromDB: FoodItemTypeEntity[] = await connection.query(`SELECT id, type from "foodItemsTypes"`);

        expect(foodItemTypesFromDB.length).toEqual(typeBody.foodItemsTypes.length);
        expect(foodItemTypesFromDB.map(({ type }) => ({ type }))).toEqual(typeBody.foodItemsTypes);

        //Add food items

        const foodItemBody: Record<string, FoodItemEntity[]> = {
            foodItems: [
                {
                    name: 'Pizza - L',
                    price: 12,
                    foodItemTypeEntity: foodItemTypesFromDB.find(({ type }) => type === 'Entree') as FoodItemTypeEntity,
                } as FoodItemEntity,
                {
                    name: 'Pepperoni',
                    price: 3,
                    foodItemTypeEntity: foodItemTypesFromDB.find(({ type }) => type === 'Pizza Topping') as FoodItemTypeEntity,
                } as FoodItemEntity,
                {
                    name: 'Buffalo Wings',
                    price: 7,
                    foodItemTypeEntity: foodItemTypesFromDB.find(({ type }) => type === 'Appetizer') as FoodItemTypeEntity,
                } as FoodItemEntity,
            ],
        };

        const foodItemResponse = await adminPostRequest(TEST_ROUTE, foodItemBody);

        expect(foodItemResponse.status).toBe(201);

        const foodItemsFromDB: FoodItemEntity[] = await connection.query(`SELECT name, price, "foodItemTypeEntityId" from "foodItems"`);

        expect(foodItemsFromDB.length).toEqual(foodItemBody.foodItems.length);

        expect(foodItemsFromDB.map(({ foodItemTypeEntityId }) => foodItemTypeEntityId).sort()).toEqual(
            foodItemTypesFromDB.map(({ id }) => id).sort()
        );

        expect(foodItemsFromDB.map(({ name, price }) => ({ name, price }))).toEqual(
            foodItemBody.foodItems.map(({ name, price }) => ({ name, price }))
        );
    });

    it('Should fail adding when foodItems not on format', async () => {
        const foodItemsToAdd = {
            foodItems: [
                {
                    name: 'Pepperoni',
                    price: 3,
                    inStock: true,
                },
                {
                    namee: 'Mushroom',
                    price: 1,
                    inStock: false,
                },
            ],
        };

        const response = await adminPostRequest(TEST_ROUTE, foodItemsToAdd);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            statusCode: 400,
            message: ['foodItems.1.name must be a string'],
            error: 'Bad Request',
        });
    });

    it('Should fail adding foodItems when id is not uuid format', async () => {
        const foodItemBody: Record<string, FoodItemEntity[]> = {
            foodItems: [
                {
                    name: 'Pizza - L',
                    price: 12,
                    foodItemTypeEntity: { id: '0' } as FoodItemTypeEntity,
                } as FoodItemEntity,
            ],
        };

        const response = await adminPostRequest(TEST_ROUTE, foodItemBody);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            errorMessage: 'Invalid input',
            detail: 'invalid input syntax for type uuid: "0"',
            internalCode: 9999,
        });
    });

    it('Should fail adding foodItemType when using duplicate name', async () => {
        const typeBody = {
            foodItemsTypes: [
                {
                    type: 'Appetizer',
                },
                {
                    type: 'Appetizer',
                },
            ],
        };

        const response = await adminPostRequest(`${TEST_ROUTE}/type`, typeBody);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Unique violation',
            detail: 'Key (type)=(Appetizer) already exists.',
            internalCode: 1234,
        });
    });

    it('Should fail adding foodItems when id is not uuid format', async () => {
        const notFoundUUID = '123e4567-e89b-12d3-a456-426614174000';

        const foodItemBody: Record<string, FoodItemEntity[]> = {
            foodItems: [
                {
                    name: 'Pizza - L',
                    price: 12,
                    foodItemTypeEntity: { id: notFoundUUID } as FoodItemTypeEntity,
                } as FoodItemEntity,
            ],
        };

        const response = await adminPostRequest(TEST_ROUTE, foodItemBody);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Foreign key violation',
            detail: `Key (foodItemTypeEntityId)=(${notFoundUUID}) is not present in table "foodItemsTypes".`,
            internalCode: 4231,
        });
    });
});
