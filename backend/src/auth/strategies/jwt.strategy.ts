import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

const accessCookieExtractor = (req: any) => {
  const v = req?.cookies?.access_token ? String(req.cookies.access_token) : null;
  if (!v) console.log('[JwtStrategy] access_token cookie NOT FOUND');
  return v;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        accessCookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(), // fallback
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'zjP9h6ZI5LoSKCRj',
    });
    console.log('[JwtStrategy] initialized');
  }

  async validate(payload: any) {
    console.log('[JwtStrategy.validate] payload:', payload);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {employee: true}
    });
    console.log('[JwtStrategy.validate] user:', user);
    if (!user) throw new UnauthorizedException('User not found');
    // Trả về object này làm req.user
    return user;
  }
}