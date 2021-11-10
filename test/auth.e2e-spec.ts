import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Config } from '../src/config/config';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let jwtService: JwtService;
    let config: Config;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());

        connection = moduleFixture.get<Connection>(Connection);
        jwtService = moduleFixture.get<JwtService>(JwtService);
        config = moduleFixture.get<Config>(Config);

        await app.init();
    });

    // // Clear DB after each test
    afterEach(async () => {
        await connection.synchronize(true);
    });

    afterAll(async () => {
        await app.close();
    });

    it('Should register new user, and use lower email', async () => {
        const credentials = { email: 'ABC@gmail.com', password: 'password' };

        const registerResult = await request(app.getHttpServer()).post('/auth/register').send(credentials).expect(201);

        const { message: registerMessage, data: registerData } = registerResult.body;

        expect(registerMessage).toBe('Successfully registered user');
        expect(typeof registerData).toBe('string');

        const userFromDb = await connection.query(`SELECT * FROM users WHERE email=$1`, [credentials.email.toLowerCase()]);
        const jwtResult = await jwtService.verifyAsync(registerData, { secret: config.JWT_SECRET });

        expect(userFromDb[0].id).toBe(jwtResult.id);
    });

    it('Should login user', async () => {
        const credentials = { email: 'ABC@gmail.com', password: 'password' };

        await request(app.getHttpServer()).post('/auth/register').send(credentials).expect(201);

        const loginResult = await request(app.getHttpServer()).post('/auth/login').send(credentials).expect(201);

        const { message: loginMessage, data: loginData } = loginResult.body;

        expect(loginMessage).toBe('Successfully login user');
        expect(typeof loginData).toBe('string');

        const userFromDb = await connection.query(`SELECT * FROM users WHERE email=$1`, [credentials.email.toLowerCase()]);

        const jwtResult = await jwtService.verifyAsync(loginData, { secret: config.JWT_SECRET });

        expect(userFromDb[0].id).toBe(jwtResult.id);
    });

    it('Should fail login user that does not exist', () => {
        const credentials = { email: 'abc@gmail.com', password: 'password' };

        return request(app.getHttpServer())
            .post('/auth/login')
            .send(credentials)
            .expect(400)
            .expect({ ...credentials, message: 'Invalid email or password, try again' });
    });

    it('Should fail login user when not passing email and password', () => {
        const credentials = { notEmail: 'abc@gmail.com', notPassword: 'password' };

        return request(app.getHttpServer())
            .post('/auth/login')
            .send(credentials)
            .expect(400)
            .expect({ statusCode: 400, message: ['email must be a string', 'password must be a string'], error: 'Bad Request' });
    });

    it('Should fail register user when email is not valid', () => {
        const credentials = { email: 'invalid email', password: 'password' };

        return request(app.getHttpServer())
            .post('/auth/register')
            .send(credentials)
            .expect(400)
            .expect({ message: 'Invalid email address provided', email: 'invalid email' });
    });
});
