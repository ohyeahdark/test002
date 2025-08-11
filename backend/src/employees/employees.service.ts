/* ============================================================
File: src/employees/employees.service.ts
Mô tả: Chứa toàn bộ logic xử lý nghiệp vụ, tương tác với DB.
============================================================
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  // Tiêm PrismaService vào để sử dụng
  constructor(private prisma: PrismaService) { }

  // Tạo nhân viên mới
  create(createEmployeeDto: CreateEmployeeDto) {
    // Tách departmentId và positionId ra khỏi DTO
    const { departmentId, positionId, ...restOfDto } = createEmployeeDto;

    return this.prisma.employee.create({
      data: {
        ...restOfDto, // Dữ liệu còn lại của nhân viên
        dateOfBirth: createEmployeeDto.dateOfBirth
          ? new Date(createEmployeeDto.dateOfBirth)
          : undefined,
        hireDate: createEmployeeDto.hireDate
          ? new Date(createEmployeeDto.hireDate)
          : undefined,
        department: { connect: { id: departmentId } }, // Kết nối với phòng ban
        position: { connect: { id: positionId } },     // Kết nối với chức vụ
      },
    });
  }

  // Lấy danh sách tất cả nhân viên
  findAll() {
    return this.prisma.employee.findMany({
      include: {
        department: true,
        position: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // Tìm một nhân viên theo ID
  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Không tìm thấy nhân viên với ID: ${id}`);
    }
    return employee;
  }

  // Cập nhật thông tin nhân viên
  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // Tách departmentId và positionId ra khỏi DTO
    const { departmentId, positionId, ...restOfDto } = updateEmployeeDto;
    return this.prisma.employee.update({
      where: { id },
      data: {
        ...restOfDto, // Dữ liệu còn lại của nhân viên
        dateOfBirth: updateEmployeeDto.dateOfBirth
          ? new Date(updateEmployeeDto.dateOfBirth)
          : undefined,
        hireDate: updateEmployeeDto.hireDate
          ? new Date(updateEmployeeDto.hireDate)
          : undefined,
        department: { connect: { id: departmentId } }, // Kết nối với phòng ban
        position: { connect: { id: positionId } },     // Kết nối với chức vụ
      },
    });
  }

  // Xóa một nhân viên
  remove(id: string) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}