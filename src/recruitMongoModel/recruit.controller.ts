import { Controller, Post, Body } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { recruitModel } from './schemas/recruit.schema';

@Controller('recruits')
export class RecruitController {
    constructor(private readonly recruitService: RecruitService) { }


    @Post('add-Recruit')
    async addRecruit(@Body() recruitData: Partial<recruitModel>): Promise<recruitModel> {
        return this.recruitService.addRecruit(recruitData);
    }
}

