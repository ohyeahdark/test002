import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async register(username: string, password: string) {
    const existed = await this.prisma.user.findUnique({ where: { username } });
    if (existed) throw new BadRequestException('Username already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, password: hashed },
    });

    const accessToken = this.jwtService.sign({ userId: user.id, role: user.role });
    return { accessToken, user: { id: user.id, username: user.username, role: user.role } };
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            department: { select: { name: true } },
            position: { select: { name: true } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for username: ${username}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = this.jwtService.sign({ userId: user.id });

    return { accessToken, user };
  }

  async fetchMe(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
      include: {
        employee: { // Quan hệ employee trong prisma schema
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            department: { select: { name: true } },
            position: { select: { name: true } }
          }
        }
      }
    });
    if (!user) throw new NotFoundException('User not found');
    console.log(user);
    return user;
  }
}
