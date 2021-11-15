import { ITokenPayload } from './../interfaces/token-payload.interface';
import { IRequestWithUser } from './../interfaces/request-with-user.interface';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { Config } from '../config/config';

@Injectable()
export class JWTGuard implements CanActivate {
    private readonly logger = new Logger(JWTGuard.name);

    constructor(private readonly config: Config) {}

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: IRequestWithUser = context.switchToHttp().getRequest();
        const token = this.getTokenFromRequest(request);

        try {
            const user = verify(token, this.config.JWT_SECRET);
            request.user = user as ITokenPayload;

            return true;
        } catch (error) {
            this.logger.error({ error, message: 'Error while verifying JWT token', token });

            throw new UnauthorizedException('Must provide valid Bearer token');
        }
    }

    private getTokenFromRequest(request: IRequestWithUser): string {
        const authorization = request.header('authorization');

        if (!authorization) {
            throw new UnauthorizedException('Must provide valid Bearer token');
        }

        // Token shape is Bearer xxx
        const authorizationParts = authorization.split(' ');

        if (authorizationParts[0] !== 'Bearer') {
            throw new UnauthorizedException('Must provide valid Bearer token');
        }

        return authorizationParts[1];
    }
}
