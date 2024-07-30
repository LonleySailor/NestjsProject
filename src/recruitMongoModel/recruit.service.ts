import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { recruitModel } from './schemas/recruit.schema';

@Injectable()
export class RecruitService {
    constructor(@InjectModel('Recruit') private readonly recruitModel: Model<recruitModel>) { }


    async addRecruit(data: Partial<recruitModel>): Promise<recruitModel> {
        return this.recruitModel.save(data);
    }

}