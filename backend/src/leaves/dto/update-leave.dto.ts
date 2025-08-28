import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateLeaveDto {
  @IsString() typeId!: string;
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
  @IsString() @IsOptional() @Length(0, 1000) reason?: string;
}