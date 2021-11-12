import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import request, { Request } from 'supertest';

let app: INestApplication;
let moduleFixture: TestingModule;
let connection: Connection;
let adminToken = '';

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
    await connection.synchronize(true);
});

global.afterAll(async () => {
    await app.close();
});

const getAdminToken = async (): Promise<string> => {
    if (adminToken) return adminToken;

    const credentials = { email: 'admin@admin.com', password: 'admin' };

    await request(app.getHttpServer()).post('/auth/register').send(credentials).expect(201);
    await connection.query(`update users set "rule" = 'admin' where email = $1`, [credentials.email]);

    const loginResult = await request(app.getHttpServer()).post('/auth/login').send(credentials).expect(201);
    adminToken = loginResult.body.data;

    return adminToken;
};

const adminPostRequest = async (route: string, body: string | object | undefined): Promise<Request> => {
    return request(app.getHttpServer())
        .post(route)
        .set('Authorization', `Bearer ${await getAdminToken()}`)
        .send(body);
};

const adminGetRequest = async (route: string): Promise<Request> => {
    return request(app.getHttpServer())
        .get(route)
        .set('Authorization', `Bearer ${await getAdminToken()}`);
};

const postRequest = async (route: string, body: string | object | undefined): Promise<Request> => {
    return request(app.getHttpServer()).post(route).send(body);
};

const getRequest = async (route: string): Promise<Request> => {
    return request(app.getHttpServer()).get(route);
};

export { app, moduleFixture, connection, adminPostRequest, adminGetRequest, postRequest, getRequest };
