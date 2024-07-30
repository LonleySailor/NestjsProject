import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type recruitDocument = HydratedDocument<recruitModel>;
@Schema()
export class recruitModel {
    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    age: number;
}

export const recruitSchema = SchemaFactory.createForClass(recruitModel);