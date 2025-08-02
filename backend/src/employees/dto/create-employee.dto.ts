import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';

enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
}

export class CreateEmployeeDto {
  @IsString() @IsNotEmpty() employeeCode: string;
  @IsString() @IsNotEmpty() name: string;
  @IsEmail() email: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() avatarUrl?: string;
  @IsString() @IsOptional() bio?: string;
  @IsString() @IsOptional() addressLine1?: string;
  @IsString() @IsOptional() addressCity?: string;
  @IsString() @IsOptional() addressCountry?: string;
  @IsEnum(EmployeeStatus) @IsOptional() status?: EmployeeStatus;
  @IsDateString() @IsOptional() dateOfBirth?: string;
  @IsDateString() @IsOptional() hireDate?: string;

  // Cập nhật quan trọng
  @IsUUID() @IsNotEmpty() departmentId: string;
  @IsUUID() @IsNotEmpty() positionId: string;
}