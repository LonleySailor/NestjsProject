import { Body, Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {  Model, Types } from 'mongoose';
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
    
    async findOneById(id: Types.ObjectId): Promise<recruitModel | null> {
          return await this.RecruitModel.findById(id).exec();
        
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
    async editTheRecruit(id: Types.ObjectId, recruitData: Partial<recruitModel>): Promise<recruitModel> {      
        const session = await this.RecruitModel.startSession();     
        session.startTransaction();
        try {
            const recruit = await this.RecruitModel.findOne({ _id: id }).session(session);
            if (!recruit) {
                throw new Error('Recruit not found');
            }

            const updatedRecruit = await this.RecruitModel.findByIdAndUpdate(
                id,
                { $set: recruitData },
                { new: true, runValidators: true, session } // Ensure schema validation is applied here
            );   
            // Commit the transaction
            await session.commitTransaction();
            return updatedRecruit;
        } catch (error) {
            await session.abortTransaction();
    
            console.log(error);
    
            if (error.name === 'ValidationError') {
                throw error; // Validation errors will be caught by the controller
            }
    
            throw new Error(error.message || 'Unknown error occurred while editing the recruit');
        } finally {
            session.endSession();
        }
    }
    
 
}
 