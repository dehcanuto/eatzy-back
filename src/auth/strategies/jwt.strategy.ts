import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.log(`JWT Strategy initialized with secret: ${secret.substring(0, 10)}...`);
  }

  async validate(payload: any) {
    this.logger.log(`JWT validated - userId: ${payload.sub}, email: ${payload.email}`);
    return { userId: payload.sub, email: payload.email };
  }
}
