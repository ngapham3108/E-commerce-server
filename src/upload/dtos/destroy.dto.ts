import { IsNotEmpty } from 'class-validator';
export class DestroyDto {
  @IsNotEmpty()
  filename: string;
}
