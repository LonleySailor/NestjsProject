import { Controller, Post, Body } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { recruitModel } from './schemas/recruit.schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller()
export class RecruitController {
    constructor(private readonly recruitService: RecruitService, @InjectQueue('recruitImport') private readonly recruitImportQueue: Queue) {

    }
    @Post('/addRecruitstoqueue')
    async addRecruitstoqueue(@Body() recruitData: Partial<recruitModel>): Promise<void> {
        this.recruitImportQueue.add('recruitImportJob', recruitData);
    }

    @Post('/addRecruits')
    async addRecruit(@Body() recruitData: Partial<recruitModel>): Promise<recruitModel> {
        console.log(recruitData)
        return this.recruitService.addRecruit(recruitData);
    }
}

