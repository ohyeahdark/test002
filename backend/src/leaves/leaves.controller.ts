import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { DecisionDto } from './dto/decision.dto';

@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) { }

  @Get('types')
  getTypes() {
    return this.leavesService.getTypes();
  }

  @Get('approvers')
  getApprovers(@Req() req: any) {
    const employeeId = req.user.employeeId ?? req.user.id;
    return this.leavesService.getApprovers(employeeId);
  }

  @Post()
  create(@Body() dto: CreateLeaveDto, @Req() req: any) {
    return this.leavesService.create(dto, req.user);
  }

  @Get('my')
  my(@Req() req: any) {
    return this.leavesService.my(req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.leavesService.cancel(id, req.user.id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Req() req: any) {
    return this.leavesService.approve(id, req.user);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() body: DecisionDto, @Req() req: any) {
    return this.leavesService.reject(id, req.user, body?.comment);
  }
}
