import { TokenService } from '../src/auth/token/token.service';
import { moduleFixture, connection, postRequestWithoutToken } from './setup-e2e';
import { UserEntity } from '../src/models/user/user.entity';
import { InternalExceptionCodes } from '../src/exceptions/internal-exception-codes.enum';

describe('Auth (e2e)', () => {
    const TEST_ROUTE = '/auth';
    let tokenService: TokenService;

    const validCredentials = { address: '1021 W Adams St #100, Chicago, IL 60607', email: 'ABC@gmail.com', password: 'password' };

    beforeAll(async () => {
        tokenService = moduleFixture.get<TokenService>(TokenService);
    });

    it('Should register new user, and use lower email', async () => {
        const registerResult = await postRequestWithoutToken(`${TEST_ROUTE}/register`, validCredentials);
        expect(registerResult.status).toBe(201);

        const { message: registerMessage, data: registerData } = registerResult.body;

        expect(registerMessage).toBe('Successfully registered user');
        expect(typeof registerData).toBe('string');

        const userFromDb = await connection.query(`SELECT * FROM users WHERE email=$1`, [validCredentials.email.toLowerCase()]);
        const jwtResult = tokenService.verify(registerData) as UserEntity;

        expect(userFromDb[0].id).toBe(jwtResult.id);
    });

    it('Should fail registering with an already existing email', async () => {
        const registerResult = await postRequestWithoutToken(`${TEST_ROUTE}/register`, validCredentials);
        expect(registerResult.status).toBe(201);

        const failedRegisterResult = await postRequestWithoutToken(`${TEST_ROUTE}/register`, validCredentials);
        expect(failedRegisterResult.status).toBe(400);
        expect(failedRegisterResult.body).toEqual({
            email: 'ABC@gmail.com',
            message: 'Email already taken. Please use a different email address',
            internalCode: InternalExceptionCodes.BAD_PARAMS,
        });
    });

    it('Should login user', async () => {
        const registerResult = await postRequestWithoutToken(`${TEST_ROUTE}/register`, validCredentials);
        expect(registerResult.status).toBe(201);

        const loginResult = await postRequestWithoutToken(`${TEST_ROUTE}/login`, validCredentials);
        expect(loginResult.status).toBe(201);

        const { message: loginMessage, data: loginData } = loginResult.body;

        expect(loginMessage).toBe('Successfully login user');
        expect(typeof loginData).toBe('string');

        const userFromDb = await connection.query(`SELECT * FROM users WHERE email=$1`, [validCredentials.email.toLowerCase()]);

        const jwtResult = tokenService.verify(loginData) as UserEntity;

        expect(userFromDb[0].id).toBe(jwtResult.id);
    });

    it('Should fail login user that does not exist', async () => {
        const loginResult = await postRequestWithoutToken(`${TEST_ROUTE}/login`, validCredentials);

        expect(loginResult.status).toBe(400);
        expect(loginResult.body).toEqual({
            password: validCredentials.password,
            email: validCredentials.email,
            message: 'Invalid email or password, try again',
            internalCode: InternalExceptionCodes.BAD_PARAMS,
        });
    });

    it('Should fail login user when not passing email and password', async () => {
        const credentials = { address: 'asd', notEmail: 'abc@gmail.com', notPassword: 'password' };

        const loginResult = await postRequestWithoutToken(`${TEST_ROUTE}/login`, credentials);
        expect(loginResult.status).toBe(400);
        expect(loginResult.body).toEqual({ statusCode: 400, message: ['email must be a string', 'password must be a string'], error: 'Bad Request' });
    });

    it('Should fail register user when email is not valid', async () => {
        const credentials = { address: 'asd', email: 'invalid email', password: 'password' };

        const loginResult = await postRequestWithoutToken(`${TEST_ROUTE}/register`, credentials);
        expect(loginResult.status).toBe(400);
        expect(loginResult.body).toEqual({
            message: 'Invalid email address provided',
            email: 'invalid email',
            internalCode: InternalExceptionCodes.BAD_PARAMS,
        });
    });
});
