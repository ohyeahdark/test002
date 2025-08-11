import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'zjP9h6ZI5LoSKCRj',
    });
  }

  async validate(payload: any) {
    // payload.userId set when sign()
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, role: true },
    });
    return user; // will be available on req.user
  }
}
