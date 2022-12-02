import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthStrategy, PrismaClient, AuthService, AuthResolver],
})
export class AuthModule {}
