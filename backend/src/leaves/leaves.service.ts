import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) { }

  async getTypes() {
    return this.prisma.leaveType.findMany({ orderBy: { name: 'asc' } });
  }

  async getApprovers(currentEmployeeId: string) {
    return this.prisma.employee.findMany({
      where: { id: { not: currentEmployeeId } },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateLeaveDto, user: { id: string; employeeId?: string; role: string }) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      throw new BadRequestException('Ngày không hợp lệ');
    if (start > end) throw new BadRequestException('startDate phải <= endDate');

    const type = await this.prisma.leaveType.findUnique({ where: { id: dto.typeId } });
    if (!type) throw new BadRequestException('Loại nghỉ không tồn tại');

    const employeeId = user.employeeId ?? user.id;

    const unique = Array.from(new Set(dto.approverEmployeeIds));
    if (unique.length !== dto.approverEmployeeIds.length)
      throw new BadRequestException('Danh sách người duyệt có trùng lặp');
    if (unique.includes(employeeId))
      throw new BadRequestException('Người nộp đơn không thể là người duyệt');

    const overlap = await this.prisma.leaveRequest.findFirst({
      where: {
        employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
      },
    });
    if (overlap) throw new BadRequestException('Khoảng thời gian bị trùng đơn khác');

    const created = await this.prisma.$transaction(async (tx) => {
      const req = await tx.leaveRequest.create({
        data: {
          employeeId,
          userId: user.id,
          typeId: dto.typeId,
          startDate: start,
          endDate: end,
          reason: dto.reason ?? null,
          status: 'PENDING',
          currentApprovalOrder: 1,
        },
      });

      await tx.leaveApproval.createMany({
        data: unique.map((approverId, idx) => ({
          leaveRequestId: req.id,
          order: idx + 1,
          approverEmployeeId: approverId,
          status: 'PENDING',
        })),
      });

      await tx.notification.create({
        data: {
          recipientEmployeeId: unique[0],
          type: 'LEAVE_REQUEST',
          title: 'Đơn nghỉ mới cần bạn duyệt',
          body: `Từ ${start.toLocaleString()} đến ${end.toLocaleString()}`,
          link: `/approvals/leaves/${req.id}`,
          data: { leaveId: req.id, step: 1, total: unique.length },
        },
      });

      return req;
    });

    return created;
  }

  async my(userId: string) {
    return this.prisma.leaveRequest.findMany({
      where: { userId },
      include: {
        approvals: true,
        type: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(id: string, userId: string) {
    const req = await this.prisma.leaveRequest.findUnique({ where: { id }, include: { approvals: true } });
    if (!req) throw new NotFoundException('Không tìm thấy đơn');
    if (req.userId !== userId) throw new ForbiddenException('Bạn không thể huỷ đơn của người khác');
    if (req.status !== 'PENDING') throw new BadRequestException('Chỉ huỷ đơn đang chờ');

    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: 'CANCELED', currentApprovalOrder: null, decidedAt: new Date() },
    });
  }

  async myPendingApprovals(employeeId: string) {
    const items = await this.prisma.leaveRequest.findMany({
      where: {
        status: 'PENDING',
        approvals: {
          some: { approverEmployeeId: employeeId, status: 'PENDING' },
        },
      },
      include: { approvals: true, type: true, employee: true },
      orderBy: { createdAt: 'desc' },
    });

    return items.filter(
      (r) =>
        r.currentApprovalOrder &&
        r.approvals.some(
          (a) =>
            a.order === r.currentApprovalOrder && a.approverEmployeeId === employeeId,
        ),
    );
  }

  async approve(id: string, actor: { id: string; employeeId?: string }) {
    const approverId = actor.employeeId ?? actor.id;

    const req = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: { approvals: true },
    });
    if (!req) throw new NotFoundException('Không tìm thấy đơn');
    if (req.status !== 'PENDING') throw new BadRequestException('Đơn không ở trạng thái chờ');
    if (!req.currentApprovalOrder)
      throw new BadRequestException('Đơn không còn bước duyệt');

    const cur = req.approvals.find((a) => a.order === req.currentApprovalOrder);
    if (!cur) throw new BadRequestException('Thiếu cấu hình bước duyệt');
    if (cur.approverEmployeeId !== approverId)
      throw new ForbiddenException('Chưa đến lượt bạn duyệt');
    if (cur.status !== 'PENDING')
      throw new BadRequestException('Bước hiện tại không hợp lệ');

    const nextOrder = req.currentApprovalOrder + 1;
    const hasNext = req.approvals.some((a) => a.order === nextOrder);

    await this.prisma.$transaction(async (tx) => {
      await tx.leaveApproval.update({
        where: { id: cur.id },
        data: { status: 'APPROVED', decidedAt: new Date() },
      });

      if (hasNext) {
        await tx.leaveRequest.update({
          where: { id: req.id },
          data: { currentApprovalOrder: nextOrder },
        });
        const next = req.approvals.find((a) => a.order === nextOrder)!;

        await tx.notification.create({
          data: {
            recipientEmployeeId: next.approverEmployeeId,
            type: 'LEAVE_REQUEST',
            title: 'Đơn nghỉ tới lượt bạn duyệt',
            body: `Bước ${nextOrder}/${req.approvals.length}`,
            link: `/approvals/leaves/${req.id}`,
            data: {
              leaveId: req.id,
              step: nextOrder,
              total: req.approvals.length,
            },
          },
        });
      } else {
        await tx.leaveRequest.update({
          where: { id: req.id },
          data: {
            status: 'APPROVED',
            decidedAt: new Date(),
            currentApprovalOrder: null,
          },
        });

        await tx.notification.create({
          data: {
            recipientEmployeeId: req.employeeId,
            type: 'LEAVE_STATUS',
            title: 'Đơn nghỉ đã được duyệt',
            link: `/leaves/${req.id}`,
            data: { leaveId: req.id },
          },
        });
      }
    });

    return { ok: true };
  }

  async reject(
    id: string,
    actor: { id: string; employeeId?: string },
    comment?: string,
  ) {
    const approverId = actor.employeeId ?? actor.id;
    const req = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: { approvals: true },
    });
    if (!req) throw new NotFoundException('Không tìm thấy đơn');
    if (req.status !== 'PENDING') throw new BadRequestException('Đơn không ở trạng thái chờ');
    if (!req.currentApprovalOrder)
      throw new BadRequestException('Đơn không còn bước duyệt');

    const cur = req.approvals.find((a) => a.order === req.currentApprovalOrder);
    if (!cur || cur.approverEmployeeId !== approverId)
      throw new ForbiddenException('Chưa đến lượt bạn');

    await this.prisma.$transaction(async (tx) => {
      await tx.leaveApproval.update({
        where: { id: cur.id },
        data: { status: 'REJECTED', comment, decidedAt: new Date() },
      });

      await tx.leaveApproval.updateMany({
        where: { leaveRequestId: req.id, order: { gt: cur.order } },
        data: { status: 'SKIPPED' },
      });

      await tx.leaveRequest.update({
        where: { id: req.id },
        data: {
          status: 'REJECTED',
          decidedAt: new Date(),
          currentApprovalOrder: null,
        },
      });

      await tx.notification.create({
        data: {
          recipientEmployeeId: req.employeeId,
          type: 'LEAVE_STATUS',
          title: 'Đơn nghỉ đã bị từ chối',
          body: comment || undefined,
          link: `/leaves/${req.id}`,
          data: { leaveId: req.id },
        },
      });
    });

    return { ok: true };
  }
}
