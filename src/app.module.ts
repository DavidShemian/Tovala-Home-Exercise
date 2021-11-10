import { Module } from '@nestjs/common';
import { DBModule } from './database/db.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AuthModule, DBModule],
})
export class AppModule {}
