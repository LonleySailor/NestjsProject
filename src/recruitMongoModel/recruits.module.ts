import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';
import { recruitSchema } from './schemas/recruit.schema';
import { RecruitImportProcessor } from './recruit-import.processor';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Recruit', schema: recruitSchema }]),
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
    controllers: [RecruitController],
    providers: [RecruitService, RecruitImportProcessor],
    exports: [RecruitService, RecruitImportProcessor],
})
export class RecruitsModule { }
