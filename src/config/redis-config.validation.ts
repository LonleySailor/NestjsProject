// src/config/redis-config.validation.ts
import { IsInt, IsString, Min, Max } from 'class-validator';

export class RedisConfig {
    @IsString()
    host: string;

    @IsInt()
    @Min(1)
    @Max(65535)
    port: number;
}
