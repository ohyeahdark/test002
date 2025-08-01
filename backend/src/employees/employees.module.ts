/* ============================================================
File: src/employees/employees.module.ts
Mô tả: Đóng gói controller và service lại với nhau.
============================================================
*/
import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule

@Module({
  imports: [PrismaModule], // Thêm PrismaModule vào đây để service có thể dùng
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}