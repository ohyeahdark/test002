import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  departmentId: string;
}