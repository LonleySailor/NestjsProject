import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RecruitService } from './recruit.service';
import { recruitModel } from './schemas/recruit.schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Types } from 'mongoose';

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

        return this.recruitService.addtheRecruit(recruitData);
    }

    @Get('/getRecruitById/:id')
    async getRecruitById(@Param('id') id: string): Promise<recruitModel | null> {
          const objectId = new Types.ObjectId(id);
          const recruit = await this.recruitService.findOneById(objectId);
          return recruit;  
     }
     
    @Get('/recruits/:page')
    async getRecruits(@Param('page') page: number): Promise<any> {
        return this.recruitService.getRecruits(page);
    }
    @Get('/recruitsByName/:name/:page')
    async getRecruitsByName(@Param('name') name: string, @Param('page') page: number): Promise<any> {
        return this.recruitService.getRecruitsByName(name, page);
    }
}

