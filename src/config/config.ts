/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
import { Injectable, Logger } from '@nestjs/common';
import { IsEnum, IsNumber, IsString, validate } from 'class-validator';
import { config } from 'dotenv';

enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    STAGING = 'staging',
    TEST = 'test',
}

interface IRequiredConfigs {
    NODE_ENV: Environment;
    PORT: number;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB_NAME: string;
}

type RequiredConfigsKeys = keyof IRequiredConfigs;

/**
 * The config service provides an interface of all the application required configurations.
 * If a required configuration is not provided, the app crashes.
 */
@Injectable()
export default class Config implements IRequiredConfigs {
    @IsEnum(Environment)
    public NODE_ENV!: Environment;

    @IsNumber()
    public PORT!: number;

    @IsString()
    public POSTGRES_DB_NAME!: string;

    @IsString()
    public POSTGRES_HOST!: string;

    @IsString()
    public POSTGRES_PASSWORD!: string;

    @IsNumber()
    public POSTGRES_PORT!: number;

    @IsString()
    public POSTGRES_USER!: string;

    private readonly logger = new Logger(Config.name);

    constructor() {
        const configs = this.getParsedConfigs();

        this.NODE_ENV = configs.NODE_ENV;
        this.PORT = configs.PORT;
        this.POSTGRES_HOST = configs.POSTGRES_HOST;
        this.POSTGRES_PASSWORD = configs.POSTGRES_PASSWORD;
        this.POSTGRES_PORT = configs.POSTGRES_PORT;
        this.POSTGRES_USER = configs.POSTGRES_USER;
        this.POSTGRES_DB_NAME = configs.POSTGRES_DB_NAME;

        validate(this).then((errors) => {
            if (errors.length > 0) {
                this.logger.error('Error while loading the configurations', errors[0].constraints);
                process.exit(1);
            }

            this.logger.log('Successfully loaded configurations');
        });
    }

    public getParsedConfigs(): IRequiredConfigs {
        config(); // Load .env file

        // Parsing numbers from string
        return Object.keys(process.env).reduce((prevModifiedConfigs, configKey) => {
            (prevModifiedConfigs[configKey as RequiredConfigsKeys] as string | number) = this.getParseValue(process.env[configKey]);

            return prevModifiedConfigs;
        }, {} as IRequiredConfigs);
    }

    // Converts string to valid types
    private getParseValue(val: any): any {
        if (isFinite(+val)) {
            return +val;
        }

        if (val === 'true') {
            return true;
        }

        if (val === 'false') {
            return false;
        }

        try {
            return JSON.parse(val);
        } catch (e) {
            // Do nothing
        }

        return val;
    }
}
