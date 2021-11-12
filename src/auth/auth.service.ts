import { TokenService } from './token/token.service';
import { UserService } from '../models/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../bases/service.base';
import { Config } from '../config/config';
import { BcryptService } from './bcrypt/bcrypt.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';

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

    public async login(email: string, password: string): Promise<string> {
        const existingUser = await this.userService.getUserByEmail(email);

        const badLoginMessage = 'Invalid email or password, try again';

        if (!existingUser) {
            throw new BadRequestException({ message: badLoginMessage, email, password });
        }

        const isPasswordMatch = await this.bcryptService.compare(password, existingUser.password);

        if (!isPasswordMatch) {
            throw new BadRequestException({ message: badLoginMessage, email, password });
        }

        return this.signToken({ id: existingUser.id, rule: existingUser.rule });
    }

    public async register(email: string, password: string): Promise<string> {
        const existingUser = await this.userService.getUserByEmail(email);

        if (existingUser) {
            throw new BadRequestException({ email, message: 'Email already taken. Please use a different email address' });
        }

        const { id, rule } = await this.userService.createUser(email, password);

        return this.signToken({ id, rule });
    }

    private signToken(payload: ITokenPayload): string {
        return this.tokenService.sign(payload);
    }
}
