import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Dùng "any" để tránh vấn đề generic giữa express-serve-static-core/ParsedQs
const cookieExtractor = (req: any) => (req?.cookies?.refresh_token ? String(req.cookies.refresh_token) : null);

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      // Lấy refresh token từ cookie thay vì Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      // FIX: đảm bảo là string, không được undefined
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'CHANGE_ME_REFRESH_SECRET',
      // KHÔNG set passReqToCallback để dùng StrategyOptionsWithoutRequest
    });
  }

  async validate(payload: any) {
    // Đính thông tin vào req.user
    return { userId: payload.sub, email: payload.email, type: 'refresh' };
  }
}