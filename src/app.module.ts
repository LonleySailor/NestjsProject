import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecruitImportProcessor } from './recruit-import.processor';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.registerQueueAsync({
      name: 'recruitImport',
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          connection: {
            host: redisConfig,
            port: 6379,
            db: redisConfig,
          },
          defaultJobOptions: {},
          concurrency: redisConfig,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [RecruitImportProcessor, AppService],

})
export class AppModule { }
