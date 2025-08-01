/* ============================================================
File: src/employees/dto/create-employee.dto.ts
Mô tả: Định nghĩa cấu trúc dữ liệu khi tạo mới một nhân viên.
Các decorator @IsString, @IsEmail,... dùng để validate dữ liệu.
============================================================
*/
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional() // phone là không bắt buộc
  phone?: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  position: string;
}