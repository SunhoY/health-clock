import { Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtTokenService } from './jwt-token.service';
import { BearerAuthGuard } from './guards/bearer-auth.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtTokenService, BearerAuthGuard],
  exports: [AuthService, JwtTokenService, BearerAuthGuard]
})
export class AuthModule {}
