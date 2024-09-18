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
        console.log("inside editTheRecruit");
       // let session: ClientSession;
       
        const session = await mongoose.startSession();
       console.log("before creating transaction");
        session.startTransaction();
        console.log("before finding");
    
        try {
            // Check if the recruit exists
            const recruit = await this.RecruitModel.findOne({ _id: id }).session(session);
            console.log("after finding");
    
            if (!recruit) {
                throw new Error('Recruit not found');
            }
    
            console.log("before updating");
    
            // Perform the update within the transaction
            const updatedRecruit = await this.RecruitModel.findByIdAndUpdate(
                id,
                { $set: recruitData },
                { new: true, runValidators: true, session } // Ensure schema validation is applied here
            );
            console.log("after updating");
    
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
 