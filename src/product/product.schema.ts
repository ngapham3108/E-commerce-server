import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;
@Schema({ timestamps: true })
export class Product {
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  product_id: string;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  price: number;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
    type: Object,
  })
  image: { filename: string; publicUrl: string };

  @Prop({
    required: true,
  })
  category: string;

  @Prop({
    default: false,
  })
  checked: boolean;

  @Prop({
    default: 0,
  })
  sold: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
