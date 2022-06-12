import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  password: string;

  @Prop({
    trim: true,
    default: 0,
  })
  role: number;

  @Prop({
    default: [],
    type: Array,
  })
  carts: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
