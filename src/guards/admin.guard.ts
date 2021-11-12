import { UserRules } from './../models/user/user-rules.enum';
import { IRequestWithOptionalUser } from './../interfaces/request-with-user.interface';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly logger = new Logger(AdminGuard.name);

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: IRequestWithOptionalUser = context.switchToHttp().getRequest();

        if (!request.user || request.user.rule !== UserRules.ADMIN) {
            this.logger.warn({ message: 'Unauthorized request attempt', url: request.url, body: request.body });

            throw new UnauthorizedException('Unauthorized');
        }

        return true;
    }
}
