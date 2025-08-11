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
      },
    });
  }

  findAll() {
    return this.prisma.position.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  update(id: string, updatePositionDto: UpdatePositionDto) {
    return this.prisma.position.update({
      where: { id },
      data: {
        name: updatePositionDto.name,
      },
    });
  }

  remove(id: string) {
    return this.prisma.position.delete({ where: { id } });
  }
}