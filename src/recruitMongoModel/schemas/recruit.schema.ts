import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type recruitDocument = HydratedDocument<recruitModel>;
@Schema()
export class recruitModel {
    @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
    _id: Types.ObjectId;
    @Prop({required:[true, 'name is required']})
    name: string;
    
    @Prop({required:[true, 'email is required']})
    email: string;
    
    @Prop( { required:[true, 'age is required'],min: 18, max: 60 } )
    age: number;
    
    @Prop({ type: Date, default: () => new Date() })
    createdAt?: Date;

}

export const recruitSchema = SchemaFactory.createForClass(recruitModel);

recruitSchema.index({ name: 1, email: 1, age: 1 }, { unique: true });

recruitSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('Recruit already exists. Please check the details.'));
    } else {
      next(error);
    }
  });