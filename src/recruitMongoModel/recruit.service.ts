import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { recruitModel } from './schemas/recruit.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class RecruitService {
    recruitsToAdd = new Set();
    constructor(@InjectModel('Recruit') private readonly RecruitModel: Model<recruitModel>) { }


    async addRecruit(data: Partial<recruitModel>): Promise<recruitModel> {

        const newRecruit = new this.RecruitModel(data);
        newRecruit.createdAt = new Date();
        console.log(`Recruit added at: ${newRecruit.createdAt}`);
        return newRecruit.save();
    }
    addRecriutsWithDelay(data: Partial<recruitModel>): void {
        this.recruitsToAdd.add(data);

    }

    @Interval(5000)
    async addRecruitsBatch(): Promise<void> {

        console.log(`Recruits to add: ${this.recruitsToAdd.size}`)

        await this.RecruitModel.insertMany([...this.recruitsToAdd].map((recruit: recruitModel) => ({ ...recruit, createdAt: new Date() })));
        console.log(`Recruits added at: ${new Date()}`)
        this.recruitsToAdd.clear();
    }

}