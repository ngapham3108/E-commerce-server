import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  product_id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsObject()
  image: { filename: string; publicUrl: string };

  @IsNotEmpty()
  category: string;
}
