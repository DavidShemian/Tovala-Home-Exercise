import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import request, { Request } from 'supertest';

let app: INestApplication;
let moduleFixture: TestingModule;
let connection: Connection;
let adminToken = '';
let customerToken = '';

jest.setTimeout(50000);

global.beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    connection = moduleFixture.get<Connection>(Connection);

    if (connection.options.database !== 'test') {
        // eslint-disable-next-line no-console
        console.error('Unable to run tests on non test DB');

        process.exit(1);
    }

    await app.init();
});

// Clear DB after each test
global.afterEach(async () => {
    adminToken = '';
    customerToken = '';
    await connection.synchronize(true);
});

global.afterAll(async () => {
    await app.close();
});

const getAdminToken = async (): Promise<string> => {
    if (adminToken) return adminToken;

    const credentials = { address: '1021 W Adams St #100, Chicago, IL 60607', email: 'admin@admin.com', password: 'admin' };

    await request(app.getHttpServer()).post('/auth/register').send(credentials).expect(201);
    await connection.query(`update users set "rule" = 'admin' where email = $1`, [credentials.email]);

    const loginResult = await request(app.getHttpServer()).post('/auth/login').send(credentials).expect(201);
    adminToken = loginResult.body.data;

    return adminToken;
};

const getCustomerToken = async (): Promise<string> => {
    if (customerToken) return customerToken;

    const credentials = { address: '1021 W Adams St #100, Chicago, IL 60607', email: 'customer@customer.com', password: 'customer' };

    await request(app.getHttpServer()).post('/auth/register').send(credentials).expect(201);

    const loginResult = await request(app.getHttpServer()).post('/auth/login').send(credentials).expect(201);
    customerToken = loginResult.body.data;

    return customerToken;
};

const adminPostRequest = async (route: string, body: string | object | undefined): Promise<Request> => {
    return postRequest(route, body, await getAdminToken());
};

const adminPutRequest = async (route: string, body: string | object | undefined): Promise<Request> => {
    return putRequest(route, body, await getAdminToken());
};

const adminGetRequest = async (route: string): Promise<Request> => {
    return getRequest(route, await getAdminToken());
};

const customerPostRequest = async (route: string, body: string | object | undefined): Promise<Request> => {
    return postRequest(route, body, await getCustomerToken());
};

const customerGetRequest = async (route: string): Promise<Request> => {
    return getRequest(route, await getCustomerToken());
};

const postRequest = async (route: string, body: string | object | undefined, token: string): Promise<Request> => {
    return request(app.getHttpServer()).post(route).set('Authorization', `Bearer ${token}`).send(body);
};

const putRequest = async (route: string, body: string | object | undefined, token: string): Promise<Request> => {
    return request(app.getHttpServer()).put(route).set('Authorization', `Bearer ${token}`).send(body);
};

const getRequest = async (route: string, token: string): Promise<Request> => {
    return request(app.getHttpServer()).get(route).set('Authorization', `Bearer ${token}`);
};

const postRequestWithoutToken = async (route: string, body: string | object | undefined): Promise<Request> => {
    return request(app.getHttpServer()).post(route).send(body);
};

const getRequestWithoutToken = async (route: string): Promise<Request> => {
    return request(app.getHttpServer()).get(route);
};

export {
    app,
    moduleFixture,
    connection,
    adminPostRequest,
    adminPutRequest,
    adminGetRequest,
    customerPostRequest,
    customerGetRequest,
    postRequestWithoutToken,
    getRequestWithoutToken,
};
