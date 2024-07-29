import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecruitImportProcessor } from './recruit-import.processor';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


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
  providers: [RecruitImportProcessor],

})
export class AppModule { }
