import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitController } from './recruit.controller';
import { RecruitService } from './recruit.service';
import { recruitSchema } from './schemas/recruit.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Recruit', schema: recruitSchema }]),
    ],
    controllers: [RecruitController],
    providers: [RecruitService],
})
export class RecruitsModule { }
