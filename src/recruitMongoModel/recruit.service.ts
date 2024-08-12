import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { recruitModel } from './schemas/recruit.schema';

@Injectable()
export class RecruitService {
    constructor(@InjectModel('Recruit') private readonly RecruitModel: Model<recruitModel>) { }


    async addRecruit(data: Partial<recruitModel>): Promise<recruitModel> {

        const newRecruit = new this.RecruitModel(data);
        newRecruit.createdAt = new Date();
        console.log(`Recruit added at: ${data.createdAt}`);
        return newRecruit.save();
    }

}