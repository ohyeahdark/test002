import { Module } from '@nestjs/common';
import { ApprovalsController } from './approvals.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeavesModule } from 'src/leaves/leaves.module';

@Module({
    imports: [LeavesModule],
    controllers: [ApprovalsController],
    providers: [PrismaService],
})
export class ApprovalsModule { }
