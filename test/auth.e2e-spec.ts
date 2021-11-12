import { TokenService } from './../src/auth/token/token.service';
import { moduleFixture, connection, postRequest } from './setup-e2e';
import { UserEntity } from './../src/models/user/user.entity';

describe('Auth (e2e)', () => {
    const TEST_ROUTE = '/auth';

    let tokenService: TokenService;

    beforeAll(async () => {
        tokenService = moduleFixture.get<TokenService>(TokenService);
    });

    // Clear DB after each test
    afterEach(async () => {
        await connection.synchronize(true);
    });

    it('Should register new user, and use lower email', async () => {
        const credentials = { email: 'ABC@gmail.com', password: 'password' };

        const registerResult = await postRequest(`${TEST_ROUTE}/register`, credentials);
        expect(registerResult.status).toBe(201);

        const { message: registerMessage, data: registerData } = registerResult.body;

        expect(registerMessage).toBe('Successfully registered user');
        expect(typeof registerData).toBe('string');

        const userFromDb = await connection.query(`SELECT * FROM users WHERE email=$1`, [credentials.email.toLowerCase()]);
        const jwtResult = tokenService.verify(registerData) as UserEntity;

        expect(userFromDb[0].id).toBe(jwtResult.id);
    });

    it('Should fail registering with an already existing email', async () => {
        const credentials = { email: 'ABC@gmail.com', password: 'password' };

        const registerResult = await postRequest(`${TEST_ROUTE}/register`, credentials);
        expect(registerResult.status).toBe(201);

        const failedRegisterResult = await postRequest(`${TEST_ROUTE}/register`, credentials);
        expect(failedRegisterResult.status).toBe(400);
        expect(failedRegisterResult.body).toEqual({
            email: 'ABC@gmail.com',
            message: 'Email already taken. Please use a different email address',
        });
    });

    it('Should login user', async () => {
        const credentials = { email: 'ABC@gmail.com', password: 'password' };

        const registerResult = await postRequest(`${TEST_ROUTE}/register`, credentials);
        expect(registerResult.status).toBe(201);

        const loginResult = await postRequest(`${TEST_ROUTE}/login`, credentials);
        expect(loginResult.status).toBe(201);

        const { message: loginMessage, data: loginData } = loginResult.body;

        expect(loginMessage).toBe('Successfully login user');
        expect(typeof loginData).toBe('string');

        const userFromDb = await connection.query(`SELECT * FROM users WHERE email=$1`, [credentials.email.toLowerCase()]);

        const jwtResult = tokenService.verify(loginData) as UserEntity;

        expect(userFromDb[0].id).toBe(jwtResult.id);
    });

    it('Should fail login user that does not exist', async () => {
        const credentials = { email: 'abc@gmail.com', password: 'password' };

        const loginResult = await postRequest(`${TEST_ROUTE}/login`, credentials);
        expect(loginResult.status).toBe(400);
        expect(loginResult.body).toEqual({ ...credentials, message: 'Invalid email or password, try again' });
    });

    it('Should fail login user when not passing email and password', async () => {
        const credentials = { notEmail: 'abc@gmail.com', notPassword: 'password' };

        const loginResult = await postRequest(`${TEST_ROUTE}/login`, credentials);
        expect(loginResult.status).toBe(400);
        expect(loginResult.body).toEqual({ statusCode: 400, message: ['email must be a string', 'password must be a string'], error: 'Bad Request' });
    });

    it('Should fail register user when email is not valid', async () => {
        const credentials = { email: 'invalid email', password: 'password' };

        const loginResult = await postRequest(`${TEST_ROUTE}/register`, credentials);
        expect(loginResult.status).toBe(400);
        expect(loginResult.body).toEqual({ message: 'Invalid email address provided', email: 'invalid email' });
    });
});
