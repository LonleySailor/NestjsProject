import { Body, Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
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
    async edittheRecruit(id: string, recruitData: Partial<recruitModel>): Promise<recruitModel> {
        console.log("Before session");
        const session = await mongoose.startSession();
        console.log("Before transaction");
        session.startTransaction();
        console.log("In service1")
    
        try {
            console.log('"In service2"');
            // Check if the recruit exists
            const recruit = await this.RecruitModel.findById(id).session(session);
    
            if (!recruit) {
                throw new Error('Recruit not found');
            }
    
            // Perform the update within the transaction
            const updatedRecruit = await this.RecruitModel.findByIdAndUpdate(
                id,
                { $set: recruitData },
                { new: true, session, runValidators: true } // Ensure schema validation is applied here
            );
    
            // Commit the transaction
            await session.commitTransaction();
            return updatedRecruit;
        } catch (error) {
            await session.abortTransaction();
    
            // Propagate errors to the controller
            if (error.name === 'ValidationError') {
                throw error; // Validation errors will be caught by the controller
            }
            throw new Error(error.message || 'Unknown error occurred while editing the recruit');
        } finally {
            session.endSession();
        }
    }
    
}
 