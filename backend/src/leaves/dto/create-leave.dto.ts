import { ArrayMinSize, IsArray, IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateLeaveDto {
  @IsString() typeId!: string;
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
  @IsString() @IsOptional() @Length(0, 1000) reason?: string;

  @IsArray() @ArrayMinSize(1)
  approverEmployeeIds!: string[]
}
