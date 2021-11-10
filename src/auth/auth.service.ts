import { UserService } from '../user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from '../bases/service.base';
import { Config } from '../config/config';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class AuthService extends BaseService {
    constructor(
        private readonly config: Config,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly bcryptService: BcryptService
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

        return this.jwtService.signAsync({ id: existingUser.id }, { secret: this.config.JWT_SECRET });
    }

    public async register(email: string, password: string): Promise<string> {
        const existingUser = await this.userService.getUserByEmail(email);

        if (existingUser) {
            throw new BadRequestException({ email }, 'Email already taken. Please use a different email address');
        }

        const { id } = await this.userService.createUser(email, password);

        return this.jwtService.signAsync({ id }, { secret: this.config.JWT_SECRET, expiresIn: '1h' });
    }
}
