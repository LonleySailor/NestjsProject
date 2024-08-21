import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';
import { recruitSchema } from './schemas/recruit.schema';
import { RecruitImportProcessor } from './recruit-import.processor';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from "@bull-board/nestjs";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Recruit', schema: recruitSchema }]),
        ScheduleModule.forRoot(),
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
                    concurrency: 100,
                };
            },
            inject: [ConfigService],
        }),
        BullBoardModule.forFeature({
            name: 'recruitImport',
            adapter: BullMQAdapter,
        }),

    ],
    controllers: [RecruitController],
    providers: [RecruitService, RecruitImportProcessor],
    exports: [RecruitService, RecruitImportProcessor],
})
export class RecruitsModule { }
