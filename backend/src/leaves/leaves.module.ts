import { Module } from '@nestjs/common';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LeavesController],
  providers: [LeavesService, PrismaService],
  exports: [LeavesService],
})
export class LeavesModule { }
