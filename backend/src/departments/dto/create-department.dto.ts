import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}