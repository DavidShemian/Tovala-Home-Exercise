import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
    @ApiProperty()
    @IsString()
    public email!: string;

    @ApiProperty()
    @IsString()
    public password!: string;
}
