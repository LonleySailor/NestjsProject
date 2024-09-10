import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type recruitDocument = HydratedDocument<recruitModel>;
@Schema()
export class recruitModel {
    @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
    _id: Types.ObjectId;
    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    age: number;
    @Prop({ type: Date, default: () => new Date() })
    createdAt?: Date;

}

export const recruitSchema = SchemaFactory.createForClass(recruitModel);