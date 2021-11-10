import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config/config';

const bootstrap = async (): Promise<void> => {
    const logger = new Logger(bootstrap.name);

    const app = await NestFactory.create(AppModule);
    const configService: Config = app.get<Config>(Config);

    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

    await app.listen(configService.PORT);
    logger.log(`Application started on port: ${configService.PORT}`);
};

bootstrap();
