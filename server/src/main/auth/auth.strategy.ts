import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/user.entity';

const APP_JWT_TOKEN_KEY = process.env.APP_JWT_TOKEN_KEY || 'JwtToken';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: APP_JWT_TOKEN_KEY,
    });
  }

  async validate(user: User) {
    const { Id, UserName } = user;
    const findUser = await this.prisma.users.findFirst({
      where: { Id, UserName },
      include: { Role: true },
    });
    if (!findUser || findUser.Password !== user.Password) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
