import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  MaxLength,
} from 'class-validator';

enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

export class CreateEmployeeDto {
  @IsString() @IsNotEmpty() @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString() @IsOptional() @MaxLength(20)
  phone?: string;

  @IsString() @IsOptional() @MaxLength(1100000)
  avatarUrl?: string;

  @IsString() @IsOptional() @MaxLength(200)
  bio?: string;

  @IsString() @IsOptional() @MaxLength(100)
  addressLine1?: string;

  @IsString() @IsOptional() @MaxLength(50)
  addressCity?: string;

  @IsString() @IsOptional() @MaxLength(50)
  addressCountry?: string;

  @IsEnum(EmployeeStatus) @IsOptional()
  status?: EmployeeStatus;

  @IsDateString() @IsOptional()
  dateOfBirth?: string;

  @IsDateString() @IsOptional()
  hireDate?: string;

  @IsUUID() @IsNotEmpty()
  departmentId: string;

  @IsUUID() @IsNotEmpty()
  positionId: string;
}
