/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { IsNumber, IsString, validate } from 'class-validator';
import { config } from 'dotenv';

enum Environment {
    development = 'development',
    production = 'production',
    staging = 'staging',
    test = 'test',
}

interface IRequiredConfigs {
    PORT: number;
    JWT_SECRET: string;
    JWT_EXPIRE_IN: string;
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
export class Config implements IRequiredConfigs {
    @IsString()
    public JWT_EXPIRE_IN!: string;

    @IsString()
    public JWT_SECRET!: string;

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
        const { NODE_ENV } = process.env;

        if (!NODE_ENV || !(NODE_ENV in Environment)) {
            this.logger.error('Must provide one of the following NODE_ENV: ', Object.keys(Environment));
            process.exit(1);
        }

        this.NODE_ENV = NODE_ENV as Environment;

        const configs = this.getParsedConfigs();

        this.JWT_SECRET = configs.JWT_SECRET;
        this.JWT_EXPIRE_IN = configs.JWT_EXPIRE_IN;
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

    public getParsedConfigs(path?: string): IRequiredConfigs {
        config({ path }); // Load .env file

        // Parsing numbers from string
        const parsedConfigs = Object.keys(process.env).reduce((prevModifiedConfigs, configKey) => {
            (prevModifiedConfigs[configKey as RequiredConfigsKeys] as string | number) = this.getParseValue(process.env[configKey]);

            return prevModifiedConfigs;
        }, {} as IRequiredConfigs);

        // Override configs with test configs if running in test environment
        if (this.NODE_ENV === Environment.test) {
            return { ...parsedConfigs, ...require('../../test/test.config.json') };
        }

        return parsedConfigs;
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
