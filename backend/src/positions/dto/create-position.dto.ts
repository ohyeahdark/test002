import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}