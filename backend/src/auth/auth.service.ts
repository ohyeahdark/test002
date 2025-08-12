import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private userService: UsersService, private jwtService: JwtService) { }

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

  async getTokens(username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: username, role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: username, role },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    const data = new UpdateUserDto();
    data.refreshToken = hashedRefresh;
    await this.userService.updateRefreshToken(id, data);
  }

  async refreshTokens(id: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { employee: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const tokens = await this.getTokens(user.id, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, ...tokens };
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
    console.log('fetchMe: ', user);
    return user;
  }

  async logout(username: string) {
    await this.prisma.user.update({
      where: { username: username },
      data: { refreshToken: null },
    });
  }
}
