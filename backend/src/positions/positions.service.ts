import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  create(createPositionDto: CreatePositionDto) {
    return this.prisma.position.create({
      data: {
        name: createPositionDto.name,
        department: {
          connect: { id: createPositionDto.departmentId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.position.findMany({
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  update(id: string, updatePositionDto: UpdatePositionDto) {
    return this.prisma.position.update({
      where: { id },
      data: {
        name: updatePositionDto.name,
        department: updatePositionDto.departmentId
          ? { connect: { id: updatePositionDto.departmentId } }
          : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.position.delete({ where: { id } });
  }
}