import { InternalExceptionCodes } from './../src/exceptions/internal-exception-codes.enum';
import { OrderEntity } from './../src/models/order/order.entity';
import { FoodItemEntity } from './../src/models/food-items/entities/food-item.entity';
import { adminPutRequest, connection, customerGetRequest, customerPostRequest } from './setup-e2e';
import { OrderStatus } from './../src/models/order/order-status.enum';

describe('Order (e2e)', () => {
    const TEST_ROUTE = '/order';

    it('Should create new order, update it status and get status', async () => {
        //Add food item types
        await connection.query(`insert into "foodItemsTypes" (type) values ('Appetizer'), ('Entree'), ('Pizza Topping')`);
        const foodItemTypes: { id: string; type: string }[] = await connection.query(`select id, type from "foodItemsTypes"`);

        const typeIds = foodItemTypes.reduce((types, { type, id }) => {
            types[type] = id;

            return types;
        }, {} as Record<string, string>);

        //Add food items
        await connection.query(
            `insert into "foodItems" (name, price, "foodItemTypeEntityId") values 
            ('Wings', 2, '${typeIds['Appetizer']}'), 
            ('Pizza - L', 2, '${typeIds['Entree']}'), 
            ('Onions', 2, '${typeIds['Pizza Topping']}')`
        );

        const foodItemsFromDb: FoodItemEntity[] = await connection.query(`select id, name, price, "inStock" from "foodItems"`);

        const orderBody = {
            foodItemsIds: foodItemsFromDb.map(({ id }) => id),
        };

        // Create order
        const orderResult = await customerPostRequest(TEST_ROUTE, orderBody);
        expect(orderResult.status).toBe(201);

        const orderFromDb: OrderEntity[] = await connection.query(`select * from orders`);
        expect(orderFromDb.length).toBe(1);

        // Validate created order matches the one in DB
        expect(orderResult.body).toMatchObject({
            message: 'Successfully submitted new order',
            data: {
                foodItems: expect.arrayContaining(foodItemsFromDb.map(({ inStock, name, price }) => ({ inStock, name, price }))),
                price: foodItemsFromDb.reduce((summand, { price }) => (summand += price), 0),
                status: 'preparing',
                user: {
                    id: orderFromDb[0].userId,
                },
                createDateTime: new Date(orderFromDb[0].createDateTime).toISOString(),
                id: orderFromDb[0].id,
                lastChangedDateTime: new Date(orderFromDb[0].lastChangedDateTime).toISOString(),
            },
        });

        const updateStatusBody = {
            status: OrderStatus.SHIPPED,
            id: orderFromDb[0].id,
        };

        // Update order status
        const updateStatusResult = await adminPutRequest(`${TEST_ROUTE}/status`, updateStatusBody);
        expect(updateStatusResult.status).toBe(200);

        // Get order status
        const getStatusResult = await customerGetRequest(`${TEST_ROUTE}/status/${orderFromDb[0].id}`);
        expect(getStatusResult.status).toBe(200);
        expect(getStatusResult.body).toEqual({
            message: 'Successfully got order status',
            data: {
                status: OrderStatus.SHIPPED,
            },
        });

        // Validate order status changed in DB
        const orderFromDbAfterStatusUpdate: OrderEntity[] = await connection.query(`select id, status from orders`);
        expect(orderFromDb.length).toBe(1);
        expect(orderFromDbAfterStatusUpdate[0].status).toBe(OrderStatus.SHIPPED);
    });

    it('Should fail creating order when there are missing food items ', async () => {
        const orderBody = {
            foodItemsIds: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
        };

        // Create order
        const orderResult = await customerPostRequest(TEST_ROUTE, orderBody);
        expect(orderResult.status).toBe(400);
        expect(orderResult.body).toEqual({
            message: '1 or more food items are missing',
            foodItemsIds: orderBody.foodItemsIds,
            internalCode: InternalExceptionCodes.BAD_PARAMS,
        });
    });

    it('Should fail getting order status when no order with given id', async () => {
        const badUUID = '123e4567-e89b-12d3-a456-426614174000';

        // Create order
        const getStatusResult = await customerGetRequest(`${TEST_ROUTE}/status/${badUUID}`);
        expect(getStatusResult.status).toBe(400);
        expect(getStatusResult.body).toEqual({
            message: 'Unable to find order',
            orderId: badUUID,
            internalCode: InternalExceptionCodes.BAD_PARAMS,
        });
    });

    it('Should fail updating order status when no order with given id', async () => {
        const badUUID = '123e4567-e89b-12d3-a456-426614174000';

        const badUpdateStatusBody = {
            status: OrderStatus.SHIPPED,
            id: badUUID,
        };

        const updateStatusResult = await adminPutRequest(`${TEST_ROUTE}/status`, badUpdateStatusBody);
        expect(updateStatusResult.status).toBe(400);
        expect(updateStatusResult.body).toMatchObject({ internalCode: InternalExceptionCodes.NOT_NULL_VIOLATION, message: 'Not null violation' });
    });
});
