import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type recruitDocument = HydratedDocument<recruitModel>;
@Schema()
export class recruitModel {
    @Prop({ type: Types.ObjectId })
    _id: Types.ObjectId;
    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    age: number;
    @Prop({ type: Date })
    createdAt?: Date;

}

export const recruitSchema = SchemaFactory.createForClass(recruitModel);