import { InternalExceptionCodes } from './../exceptions/internal-exception-codes.enum';
import { CustomBadRequestException } from './../exceptions/bad-request.exception';
import { LoginDTO } from './DTO/login.dto';
import { TokenService } from './token/token.service';
import { UserService } from '../models/user/user.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../bases/service.base';
import { Config } from '../config/config';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';
import { RegisterDTO } from './DTO/register.dto';

@Injectable()
export class AuthService extends BaseService {
    constructor(
        private readonly config: Config,
        private readonly userService: UserService,
        private readonly bcryptService: BcryptService,
        private readonly tokenService: TokenService
    ) {
        super();
    }

    public async login({ email, password }: LoginDTO): Promise<string> {
        const existingUser = await this.userService.getUserByEmail(email);

        const badLoginMessage = 'Invalid email or password, try again';

        if (!existingUser) {
            throw new CustomBadRequestException(InternalExceptionCodes.BAD_PARAMS, { message: badLoginMessage, email, password });
        }

        const isPasswordMatch = await this.bcryptService.compare(password, existingUser.password);

        if (!isPasswordMatch) {
            throw new CustomBadRequestException(InternalExceptionCodes.BAD_PARAMS, { message: badLoginMessage, email, password });
        }

        return this.signToken({ id: existingUser.id, rule: existingUser.rule });
    }

    public async register({ address, email, password }: RegisterDTO): Promise<string> {
        const existingUser = await this.userService.getUserByEmail(email);

        if (existingUser) {
            throw new CustomBadRequestException(InternalExceptionCodes.BAD_PARAMS, {
                email,
                message: 'Email already taken. Please use a different email address',
            });
        }

        const { id, rule } = await this.userService.createUser(address, email, password);

        return this.signToken({ id, rule });
    }

    private signToken(payload: ITokenPayload): string {
        return this.tokenService.sign(payload);
    }
}
