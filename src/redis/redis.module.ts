import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisConfig from '../config/redis.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [redisConfig],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                host: configService.get<string>('host'),
                port: configService.get<number>('port'),
            }),
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>('host'),
                    port: configService.get<number>('port'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [ConfigService],
    exports: [BullModule],
})
export class CustomRedisModule { }
