import { Controller, Get, Patch, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
constructor(private readonly prisma: PrismaService) {}


@Get('unread-count')
async unread(@Req() req: any) {
const employeeId = req.user.employeeId ?? req.user.id;
const count = await this.prisma.notification.count({ where: { recipientEmployeeId: employeeId, readAt: null } });
return { count };
}


@Get()
async list(@Req() req: any, @Query('limit') limit = '20') {
const employeeId = req.user.employeeId ?? req.user.id;
const items = await this.prisma.notification.findMany({
where: { recipientEmployeeId: employeeId },
orderBy: { createdAt: 'desc' },
take: Math.min(parseInt(String(limit) || '20', 10), 50),
});
return { items };
}


@Patch(':id/read')
async read(@Param('id') id: string, @Req() req: any) {
const employeeId = req.user.employeeId ?? req.user.id;
const n = await this.prisma.notification.findUnique({ where: { id } });
if (!n || n.recipientEmployeeId !== employeeId) return { ok: false };
await this.prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
return { ok: true };
}
}