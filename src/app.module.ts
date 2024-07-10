import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecruitImportProcessor } from './recruit-import.processor';
import { ConfigModule } from '@nestjs/config';
import { CustomRedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CustomRedisModule,
    BullModule.registerQueueAsync({
      name: 'recrutImport',
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          connection: {
            host: redisConfig.uri,
            port: 6379,
            db: redisConfig.db,
          },
          concurrency: redisConfig.concurrency,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [RecruitImportProcessor],

})
export class AppModule { }
