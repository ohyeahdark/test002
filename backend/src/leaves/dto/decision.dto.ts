import { IsString, IsOptional, Length } from 'class-validator';

export class DecisionDto {
  @IsString() @IsOptional() @Length(0, 500)
  comment?: string;
}
