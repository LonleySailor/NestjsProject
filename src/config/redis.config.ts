import 'dotenv/config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { RedisConfig } from './redis-config.validation';
import { ConfigService } from '@nestjs/config';

export default () => {
    const configService = new ConfigService();

    const config = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    };

    const validatedConfig = plainToClass(RedisConfig, config);
    const errors = validateSync(validatedConfig);

    if (errors.length > 0) {
        throw new Error(`Config validation error: ${errors.toString()}`);
    }

    return validatedConfig;
};
