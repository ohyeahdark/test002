import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      data.password,
      roundsOfHashing,
    );

    data.password = hashedPassword;
    return this.prisma.user.create({ data });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ include: { employee: true } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { employee: true } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(
        data.password,
        roundsOfHashing,
      );
    }
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async logout(userId: string): Promise<User> {
    return this.update(userId, { refreshToken: undefined });
  }

  async updateRefreshToken(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id : id }, data });
  }
}