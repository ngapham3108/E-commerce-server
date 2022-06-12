import { IsObject, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  title: string;
  @IsOptional()
  price: number;
  @IsOptional()
  description: string;
  @IsOptional()
  content: string;
  @IsOptional()
  @IsObject()
  image: { filename?: string; publicUrl?: string };
  @IsOptional()
  category: string;
}
