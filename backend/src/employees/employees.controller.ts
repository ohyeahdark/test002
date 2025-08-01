/* ============================================================
File: src/employees/employees.controller.ts
Mô tả: Định nghĩa các routes (endpoints) cho API.
============================================================
*/
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees') // Tiền tố cho tất cả các route trong controller này là /employees
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post() // POST /employees
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get() // GET /employees
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id') // GET /employees/:id
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id') // PATCH /employees/:id
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id') // DELETE /employees/:id
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }
}