import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [PrismaModule, EmployeesModule, DepartmentsModule, PositionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}