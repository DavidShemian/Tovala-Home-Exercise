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
    DB_LOCATION: string;
}

type RequiredConfigsKeys = keyof IRequiredConfigs;

/**
 * The config service provides an interface of all the application required configurations.
 * If a required configuration is not provided, the app crashes.
 */
@Injectable()
export class Config implements IRequiredConfigs {
    @IsString()
    public DB_LOCATION!: string;

    @IsString()
    public JWT_SECRET!: string;

    public NODE_ENV!: Environment;

    @IsNumber()
    public PORT!: number;

    private readonly logger = new Logger(Config.name);

    constructor() {
        const { NODE_ENV } = process.env;

        if (!NODE_ENV || !(NODE_ENV in Environment)) {
            this.logger.error('Must provide one of the following NODE_ENV: ', Object.keys(Environment));
            process.exit(1);
        }

        this.NODE_ENV = NODE_ENV as Environment;

        const configs = this.getParsedConfigs();

        this.DB_LOCATION = configs.DB_LOCATION;
        this.JWT_SECRET = configs.JWT_SECRET;
        this.PORT = configs.PORT;

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
