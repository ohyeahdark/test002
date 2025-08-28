import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeavesService } from 'src/leaves/leaves.service';

@UseGuards(JwtAuthGuard)
@Controller('approvals')
export class ApprovalsController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly leavesService: LeavesService,
    ) { }

    @Get('pending')
    async myPending(@Req() req: any) {
        const employeeId = req.user.employeeId ?? req.user.id;
        return this.leavesService.myPendingApprovals(employeeId);
    }
}
