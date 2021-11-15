import { Body, Controller, Post } from '@nestjs/common';
import { UserRules } from 'src/models/user/user-rules.enum';
import { BaseController } from '../bases/controller.base';
import { ISuccessfulResponse } from '../interfaces/successful-response.interface';
import { AuthService } from './auth.service';
import { LoginDTO } from './DTO/login.dto';
import { RegisterDTO } from './DTO/register.dto';

@Controller('/auth')
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Post('login')
    public async login(@Body() loginDTO: LoginDTO): Promise<ISuccessfulResponse<string>> {
        const token = await this.authService.login(loginDTO);

        return this.responseSuccess('Successfully login user', token);
    }

    @Post('register')
    public async register(@Body() registerDTO: RegisterDTO): Promise<ISuccessfulResponse<string>> {
        const token = await this.authService.register(registerDTO, UserRules.CUSTOMER);

        return this.responseSuccess('Successfully registered user', token);
    }

    @Post('register/admin')
    public async registerAdmin(@Body() registerDTO: RegisterDTO): Promise<ISuccessfulResponse<string>> {
        const token = await this.authService.register(registerDTO, UserRules.ADMIN);

        return this.responseSuccess('Successfully registered user', token);
    }
}
