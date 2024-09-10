import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { recruitModel } from './schemas/recruit.schema';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class RecruitService {
    recruitsToAdd = new Set();
    constructor(@InjectModel('Recruit') private readonly RecruitModel: Model<recruitModel>) { }


    async addtheRecruit(data: Partial<recruitModel>): Promise<recruitModel> {

        const newRecruit = new this.RecruitModel(data);
        console.log(`Recruit added at: ${newRecruit.createdAt}`);
        return newRecruit.save();
    }
    addRecriutsWithDelay(data: Partial<recruitModel>): void {
        this.recruitsToAdd.add(data);

    }

    @Interval(5000)
    async addRecruitsBatch(): Promise<void> {

        console.log(`Recruits to add: ${this.recruitsToAdd.size}`)

        await this.RecruitModel.insertMany([...this.recruitsToAdd]);
        console.log(`Recruits added at: ${new Date()}`)
        this.recruitsToAdd.clear();
    }
    async findOneById(id: Types.ObjectId): Promise<recruitModel> {
        return this.RecruitModel.findById(id).exec();
    }


    async getRecruits(page: number): Promise<any> {
        const limit = 50;
        const skip = (page - 1) * limit;
        const recruits = await this.RecruitModel.find()
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return recruits;
    }
    async getRecruitsByName(name: string, page: number): Promise<any> {
        const limit = 50;
        const skip = (page - 1) * limit;
        const recruits = await this.RecruitModel.find({ name: { $regex: name, $options: 'i' } })
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit)
            .exec();
        return recruits;
    }
}


