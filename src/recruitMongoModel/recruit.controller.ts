import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
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
      try {
        console.log(recruitData);
  
        // Attempt to add the recruit
        return await this.recruitService.addtheRecruit(recruitData);
      } catch (error) {
        // Handle specific MongoDB errors
        if (error.code === 11000) { // Duplicate key error code
          throw new HttpException('Recruit already exists. Please check the details.', HttpStatus.BAD_REQUEST);
        }
        else if (error.name === 'ValidationError') {
          const validationError = error.errors;
          const errorMessage = Object.keys(validationError).map(key => validationError[key].message).join(', ');
          throw new HttpException(`Validation failed. ${errorMessage}`, HttpStatus.BAD_REQUEST);
        }
        
        // Handle other unexpected errors
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
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
    @Post('/editRecruits/:ID')
    async editRecruits(@Param('ID') id: string, @Body() recruitData: Partial<recruitModel>): Promise<recruitModel> {
      try {
        console.log("In controller")
        // Attempt to edit the recruit
        return await this.recruitService.edittheRecruit(id, recruitData);
      } catch (error) {
        // Handle specific MongoDB errors
        if (error.code === 11000) { // Duplicate key error code
          throw new HttpException('Duplicate recruit found. Please check the email.', HttpStatus.BAD_REQUEST);
        }
        else if (error.name === 'ValidationError') {
          const validationError = error.errors;
          const errorMessage = Object.keys(validationError).map(key => validationError[key].message).join(', ');
          throw new HttpException(`Validation failed. ${errorMessage}`, HttpStatus.BAD_REQUEST);
        } 
        else if (error.message === 'Recruit not found') {
          throw new HttpException('Recruit with this ID does not exist.', HttpStatus.NOT_FOUND);
        }
        
        // Handle other unexpected errors
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


