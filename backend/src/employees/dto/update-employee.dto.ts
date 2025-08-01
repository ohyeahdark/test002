/* ============================================================
File: src/employees/dto/update-employee.dto.ts
Mô tả: Sử dụng PartialType để làm cho tất cả các trường trong
CreateEmployeeDto trở thành không bắt buộc khi cập nhật.
============================================================
*/
import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}